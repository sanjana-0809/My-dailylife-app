FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run as the unprivileged built-in node user
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node

EXPOSE 5000

CMD ["node", "src/index.js"]
