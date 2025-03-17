#!/bin/bash

# Install dependencies
npm install

# Build the project
npm run build

# Copy index.html to 404.html for client-side routing
cp dist/index.html dist/404.html 