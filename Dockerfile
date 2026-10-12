FROM node:18-alpine

# Force fresh dependency install
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Clean install to avoid cached node_modules issues
RUN rm -rf node_modules && npm ci --only=production

# Copy all application code
COPY . .

# Verify structure
RUN ls -la /app/app/

EXPOSE 80

CMD ["node", "app/server.js"]
