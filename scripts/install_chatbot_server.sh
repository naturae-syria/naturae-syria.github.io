#!/bin/bash
set -euo pipefail

# Install dependencies and build the chatbot server
# This script installs Node.js, pnpm, project dependencies, and builds the project.
# It will prompt for the OpenAI key and desired port if they are not provided as
# arguments.

REPO_URL="https://github.com/naturae-syria/naturae-syria.github.io.git"
TARGET_DIR=${1:-naturae-syria.github.io}
API_KEY=${2:-}
PORT=${3:-}


if [[ -z "$API_KEY" ]]; then
  read -rp "Enter your OpenAI API key: " API_KEY
fi

if [[ -z "$PORT" ]]; then
  read -rp "Enter port to run the app [3000]: " PORT
  PORT=${PORT:-3000}
fi

# Ensure git is installed
if ! command -v git >/dev/null; then
  sudo apt-get update
  sudo apt-get install -y git
fi

# Clone repository if needed
if [[ ! -d "$TARGET_DIR" ]]; then
  git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"


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

CERT_DIR="cert"
mkdir -p "$CERT_DIR"
if [[ ! -f "$CERT_DIR/fullchain.pem" || ! -f "$CERT_DIR/privkey.pem" ]]; then
  if command -v mkcert >/dev/null; then
    echo "Generating certificate with mkcert..."
    mkcert -key-file "$CERT_DIR/privkey.pem" -cert-file "$CERT_DIR/fullchain.pem" localhost 127.0.0.1
  else
    echo "Generating self-signed certificate..."
    openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
      -keyout "$CERT_DIR/privkey.pem" \
      -out "$CERT_DIR/fullchain.pem" \
      -subj "/CN=localhost"
    echo "Consider installing mkcert for a locally trusted certificate."
  fi
fi

echo "Installation complete. Start the server with: PORT=$PORT pnpm run start:https"
