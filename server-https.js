const { createServer } = require('https');
const { readFileSync } = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const CERT_DIR = process.env.CERT_DIR || 'cert';

app.prepare().then(() => {
  const options = {
    key: readFileSync(`${CERT_DIR}/privkey.pem`),
    cert: readFileSync(`${CERT_DIR}/fullchain.pem`),
  };

  createServer(options, (req, res) => {
    handle(req, res);
  }).listen(PORT, () => {
    console.log(`> Ready on https://localhost:${PORT}`);
    console.log(`> Chat API: https://localhost:${PORT}/api/chat`);
    console.log(`> WhatsApp API: https://localhost:${PORT}/api/whatsapp`);
  });
});
