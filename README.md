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

2. Create a `.env.local` file in the project root and provide your OpenAI API key:

   ```bash
   OPENAI_API_KEY=your-api-key
   ```

   This key is required for the chatbot features in `actions/chat-actions.ts` and `functions/chat.js`.

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

## Netlify Functions

The project includes a serverless function located in `functions/chat.js`. When deployed on Netlify these functions are automatically built and exposed under the `/api/*` path as configured in `netlify.toml`.

