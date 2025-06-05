const { createServer } = require('http');
const { createServer: createHttpsServer } = require('https');
const { readFileSync } = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const CERT_DIR = process.env.CERT_DIR || 'cert';

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(HTTP_PORT, () => {
    console.log(`> Ready on http://localhost:${HTTP_PORT}`);
    console.log(`> Chat API: http://localhost:${HTTP_PORT}/api/chat`);
    console.log(`> WhatsApp API: http://localhost:${HTTP_PORT}/api/whatsapp`);
  });

  const options = {
    key: readFileSync(`${CERT_DIR}/privkey.pem`),
    cert: readFileSync(`${CERT_DIR}/fullchain.pem`),
  };

  createHttpsServer(options, (req, res) => {
    handle(req, res);
  }).listen(HTTPS_PORT, () => {
    console.log(`> Ready on https://localhost:${HTTPS_PORT}`);
    console.log(`> Chat API: https://localhost:${HTTPS_PORT}/api/chat`);
    console.log(`> WhatsApp API: https://localhost:${HTTPS_PORT}/api/whatsapp`);
  });
});
