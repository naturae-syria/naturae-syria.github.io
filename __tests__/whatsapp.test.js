process.env.OPENAI_API_KEY = 'test';
process.env.WHATSAPP_VERIFY_TOKEN = 'test-token';
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
