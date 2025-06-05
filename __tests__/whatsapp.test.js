process.env.OPENAI_API_KEY = 'test';
process.env.WHATSAPP_TOKEN = 'token';
process.env.WHATSAPP_PHONE_NUMBER_ID = 'phone';
process.env.WHATSAPP_VERIFY_TOKEN = 'test-token';

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: { url: '' } })
}));

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'reply' } }]
          })
        }
      },
      audio: {
        speech: { create: jest.fn().mockResolvedValue({ arrayBuffer: async () => new ArrayBuffer(1) }) },
        transcriptions: { create: jest.fn().mockResolvedValue({ text: 'hi' }) }
      }
    }))
  };
});

const { handler } = require('../functions/whatsapp');

test('verifies webhook challenge', async () => {
  const event = {
    httpMethod: 'GET',
    queryStringParameters: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-token',
      'hub.challenge': '42'
    }
  };
  const res = await handler(event);
  expect(res.statusCode).toBe(200);
  expect(res.body).toBe('42');
});

test('handles text message', async () => {
  const body = {
    entry: [
      { changes: [ { value: { messages: [ { from: '1', type: 'text', text: { body: 'hi' } } ] } } ] }
    ]
  };
  const event = { httpMethod: 'POST', body: JSON.stringify(body) };
  const res = await handler(event);
  expect(res.statusCode).toBe(200);
  const axios = require('axios');
  expect(axios.post).toHaveBeenCalled();
});

test('skips sending when credentials missing', async () => {
  process.env.WHATSAPP_TOKEN = '';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '';
  jest.resetModules();
  const { handler } = require('../functions/whatsapp');
  const body = {
    entry: [
      { changes: [ { value: { messages: [ { from: '1', type: 'text', text: { body: 'hi' } } ] } } ] }
    ]
  };
  const event = { httpMethod: 'POST', body: JSON.stringify(body) };
  const axios = require('axios');
  axios.post.mockClear();
  const res = await handler(event);
  expect(res.statusCode).toBe(200);
  expect(axios.post).not.toHaveBeenCalled();
});
