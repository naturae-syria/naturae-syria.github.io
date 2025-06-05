process.env.OPENAI_API_KEY = 'test';

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'reply' } }]
          })
        }
      }
    }))
  };
});

const { handler } = require('../functions/chat');

test('returns chat reply', async () => {
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({ message: 'hello' })
  };
  const res = await handler(event);
  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body).response).toBe('reply');
});
