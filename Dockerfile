
# Stage 1: Build Frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev

# Copy built assets
COPY --from=builder /app/dist ./dist
# Copy server code
COPY server ./server

EXPOSE 3000
CMD ["node", "server/index.js"]
