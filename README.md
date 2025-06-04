# Naturae Syria Website

This repository contains the source code for the Naturae Syria website and chatbot. It is a Next.js project with Netlify Functions for serverless API routes.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (or npm/yarn) for managing packages

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. (Optional) Run the automated install script which clones the repository (if needed), installs Node.js and pnpm, then installs dependencies and builds the project. It will prompt for your OpenAI API key and desired port if they are not supplied:

   ```bash
   ./scripts/install_chatbot_server.sh [target-dir] [OPENAI_API_KEY] [PORT]
   ```

   The script writes these values to `.env.local`, installs all dependencies, opens the selected port with `ufw` (when available), and builds the project.


3. If you prefer to create `.env.local` manually, provide your OpenAI API key like so:

   ```bash
   OPENAI_API_KEY=your-api-key
   OPENAI_MODEL=gpt-3.5-turbo
   PRODUCT_CONTEXT_LIMIT=30
   PORT=3000
  ```

`OPENAI_MODEL` sets which model to use (defaults to `gpt-3.5-turbo`).
`PRODUCT_CONTEXT_LIMIT` controls how many products are included in each
request to keep the token count below OpenAI's limit.

### Product data

The static storefront reads its catalog from `products.js`. To keep this file
unchanged while still making the list available to the chatbot server, an
identical copy is exported from `data/products.js`. Both files contain the same
array of products and `data/products.js` provides an ES module export so server
code can import it without altering the original data.

   The `PORT` variable controls which port the server listens on when running `pnpm run start`.

## Development

Run the development server with:

```bash
pnpm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000) by default.

## Build

To create a production build run:

```bash
pnpm run build
```

You can then start the built application locally with:

```bash
pnpm run start
```

The server listens on the port defined in `.env.local` (defaults to `3000`).
When deployed on your AWS instance (e.g. `56.125.95.223`) you can access the
site using `http://<server-ip>:<port>`.

If you need HTTPS, place certificate files in a directory named `cert` or let
the install script generate a self‑signed certificate automatically. Then start
the server with:

```bash
pnpm run start:https
```

This launches `server-https.js` which wraps the Next.js app with Node's HTTPS
server. The `cert` folder should contain `fullchain.pem` and `privkey.pem`.
Sample self-signed files are included for local development.

### Using a trusted certificate

If you see `ERR_CERT_AUTHORITY_INVALID`, the browser does not trust your SSL certificate. For local development you can install [mkcert](https://github.com/FiloSottile/mkcert) and generate a locally trusted certificate:

```bash
sudo apt-get install -y libnss3-tools
mkcert -install
mkcert -key-file cert/privkey.pem -cert-file cert/fullchain.pem localhost 127.0.0.1
```

For production, obtain a certificate from a provider such as Let's Encrypt and place the resulting `fullchain.pem` and `privkey.pem` files in the `cert` directory.

## Deploying on AWS

1. **Clone the repository** onto your EC2 instance and run the install script. It installs Node.js, pnpm and all dependencies, then builds the project and opens the chosen port with `ufw` when available:

   ```bash
   ./scripts/install_chatbot_server.sh naturae-syria.github.io YOUR_OPENAI_KEY 3000
   ```

2. **Start the server** after installation:

   ```bash
   pnpm run start
   ```

   The app will listen on the port you specified in `.env.local`.

  The startup output may display the machine's private IP address (e.g. `172.31.x.x`). This is normal—Next.js listens on all interfaces by default. Access the app from other devices using your server's public IP, e.g. `http://56.125.95.223:3000/`. You do **not** need to set `--hostname` to the public IP.


3. **Point the front end** to your server by editing the snippet in `index.html` so it matches your server's IP address and port:

   ```html
  <script>
    const CHAT_HOST = "56.125.95.223"
    const CHAT_PORT = "3000"
    const protocol = location.protocol === "https:" ? "https" : "http"
    window.CHAT_API_URL = `${protocol}://${CHAT_HOST}:${CHAT_PORT}/api/chat`
  </script>
   ```

   Upload the updated static site to GitHub Pages at `https://naturae-syria.github.io/`.

## Connecting the Front End

The static site in `index.html` needs to know where to send chat requests.
Before uploading the site to GitHub Pages, edit the following snippet near the
bottom of `index.html` and replace the port if necessary:

```html
<script>
  const CHAT_HOST = "56.125.95.223"
  const CHAT_PORT = "3000"
  const protocol = location.protocol === "https:" ? "https" : "http"
  window.CHAT_API_URL = `${protocol}://${CHAT_HOST}:${CHAT_PORT}/api/chat`
</script>
```

If your server uses a different IP or port, update the URL in the snippet so it
matches your deployment, e.g. `http://<server-ip>:<port>/api/chat`. The
client-side script in `main.js` reads this variable to communicate with the
chatbot server.


## Netlify Functions

The project includes a serverless function located in `functions/chat.js`. When deployed on Netlify these functions are automatically built and exposed under the `/api/*` path as configured in `netlify.toml`.

