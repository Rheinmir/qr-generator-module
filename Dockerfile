# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies (cache optimized)
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
