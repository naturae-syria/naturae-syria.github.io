const { OpenAI } = require('openai');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const FormData = require('form-data');

const productsData = require('../data/products.js');

async function loadProducts() {
  return productsData.default || productsData;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getProductsContext() {
  const products = await loadProducts();
  return products
    .map((product) => {
      return `
اسم المنتج: ${product.name}
العلامة التجارية: ${product.brand}
الخط: ${product.line}
الفئة: ${product.category}
الوصف: ${product.description || 'غير متوفر'}
طريقة الاستخدام: ${product.usage || 'غير متوفر'}
الشرح: ${product.explanation || 'غير متوفر'}
السعر: $${product.price ? (Math.ceil(product.price * (1 / 5.2) * 10) / 10).toFixed(1) : 'غير متوفر'}
    `;
    })
    .join('\n---\n');
}

const WA_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

async function sendText(to, body) {
  if (!WA_TOKEN || !PHONE_NUMBER_ID) return;
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    { messaging_product: 'whatsapp', to, text: { body } },
    { headers: { Authorization: `Bearer ${WA_TOKEN}` } }
  );
}

async function sendVoice(to, body) {
  if (!WA_TOKEN || !PHONE_NUMBER_ID) return;
  const speech = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: body,
  });
  const buffer = Buffer.from(await speech.arrayBuffer());
  const tmp = path.join(os.tmpdir(), `${Date.now()}.mp3`);
  await fs.promises.writeFile(tmp, buffer);
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('file', fs.createReadStream(tmp));
  form.append('type', 'audio/mpeg');
  const upload = await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/media`,
    form,
    { headers: { Authorization: `Bearer ${WA_TOKEN}`, ...form.getHeaders() } }
  );
  await fs.promises.unlink(tmp);
  const mediaId = upload.data.id;
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    { messaging_product: 'whatsapp', to, type: 'audio', audio: { id: mediaId } },
    { headers: { Authorization: `Bearer ${WA_TOKEN}` } }
  );
}

async function downloadMedia(mediaId) {
  const meta = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
    params: { access_token: WA_TOKEN },
  });
  const url = meta.data.url;
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${WA_TOKEN}` },
  });
  return res.data;
}

async function transcribeVoice(mediaId) {
  const data = await downloadMedia(mediaId);
  const tmp = path.join(os.tmpdir(), `${mediaId}.ogg`);
  await fs.promises.writeFile(tmp, data);
  const transcript = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tmp),
    model: 'whisper-1',
  });
  await fs.promises.unlink(tmp);
  return transcript.text;
}

async function createReply(userText) {
  const ctx = await getProductsContext();
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a beauty assistant for Naturae and Avon products. Reply in the same language as the user and mention relevant items from the list below.\n\n${ctx}`,
      },
      { role: 'user', content: userText },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  return resp.choices[0].message.content;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === VERIFY_TOKEN) {
      return { statusCode: 200, body: params['hub.challenge'] };
    }
    return { statusCode: 403, body: 'Verification failed' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const body = JSON.parse(event.body || '{}');
  const entries = body.entry || [];

  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value || {};
      const messages = value.messages || [];
      for (const msg of messages) {
        const from = msg.from;
        try {
          if (msg.type === 'text' && msg.text) {
            const reply = await createReply(msg.text.body);
            await sendText(from, reply);
          } else if (msg.type === 'image' && msg.image) {
            const caption = msg.image.caption || '';
            const reply = await createReply(caption || '');
            await sendText(from, reply);
          } else if ((msg.type === 'audio' && msg.audio) || (msg.type === 'voice' && msg.voice)) {
            const mediaId = (msg.audio && msg.audio.id) || (msg.voice && msg.voice.id);
            const text = await transcribeVoice(mediaId);
            const reply = await createReply(text);
            await sendVoice(from, reply);
          }
        } catch (err) {
          console.error('Error handling message', err);
        }
      }
    }
  }

  return { statusCode: 200, body: 'OK' };
};
