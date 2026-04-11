#!/bin/bash

echo "Deploying Frontend to Netlify..."

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Netlify (requires netlify-cli)
# Install netlify-cli if not already installed
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

echo "Frontend deployment completed!"
