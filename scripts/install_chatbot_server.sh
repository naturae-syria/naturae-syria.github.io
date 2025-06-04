#!/bin/bash
set -euo pipefail

# Install dependencies and build the chatbot server
# This script installs Node.js, pnpm, project dependencies, and builds the project.
# It will prompt for the OpenAI key and desired port if they are not provided as
# arguments.

API_KEY=${1:-}
PORT=${2:-}

if [[ -z "$API_KEY" ]]; then
  read -rp "Enter your OpenAI API key: " API_KEY
fi

if [[ -z "$PORT" ]]; then
  read -rp "Enter port to run the app [3000]: " PORT
  PORT=${PORT:-3000}
fi

# Install Node.js if missing
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install pnpm if missing
if ! command -v pnpm >/dev/null; then
  npm install -g pnpm
fi

# Install project dependencies
pnpm install

# Write environment file
cat > .env.local <<EOS
OPENAI_API_KEY=$API_KEY
PORT=$PORT
EOS

# Build the project
pnpm run build

# Open the chosen port if using ufw firewall
if command -v ufw >/dev/null; then
  sudo ufw allow "$PORT"
fi

echo "Installation complete. Start the server with: PORT=$PORT pnpm run start"
