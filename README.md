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


## Netlify Functions

The project includes a serverless function located in `functions/chat.js`. When deployed on Netlify these functions are automatically built and exposed under the `/api/*` path as configured in `netlify.toml`.

