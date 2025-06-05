const axios = require('axios');

async function main() {
  const { WHATSAPP_APP_ID, WHATSAPP_APP_SECRET, WHATSAPP_TOKEN } = process.env;
  if (!WHATSAPP_TOKEN || !WHATSAPP_APP_ID || !WHATSAPP_APP_SECRET) {
    console.error('Please set WHATSAPP_APP_ID, WHATSAPP_APP_SECRET and WHATSAPP_TOKEN');
    process.exit(1);
  }
  try {
    const res = await axios.get('https://graph.facebook.com/debug_token', {
      params: {
        input_token: WHATSAPP_TOKEN,
        access_token: `${WHATSAPP_APP_ID}|${WHATSAPP_APP_SECRET}`,
      },
    });
    console.log('Token details:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Failed to verify token:', err.response?.data || err.message);
    process.exit(1);
  }
}

main();
