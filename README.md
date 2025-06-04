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
   PORT=3000
   ```

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
When deployed on your AWS instance (e.g. `18.228.211.21`) you can access the
site using `http://<server-ip>:<port>`.

## Connecting the Front End

The static site in `index.html` needs to know where to send chat requests.
Before uploading the site to GitHub Pages, edit the following snippet near the
bottom of `index.html` and replace the port if necessary:

```html
<script>
  window.CHAT_API_URL = "http://18.228.211.21:3000/api/chat"
</script>
```

If your server runs on a different port, adjust the URL accordingly. The
client-side script in `main.js` reads this variable to communicate with the
chatbot server.

## Netlify Functions

The project includes a serverless function located in `functions/chat.js`. When deployed on Netlify these functions are automatically built and exposed under the `/api/*` path as configured in `netlify.toml`.

