# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files from api directory
COPY api/package*.json ./

# Install dependencies (disable strict SSL for corporate proxies if needed)
RUN npm config set strict-ssl false && \
    npm install

# Copy TypeScript config and source code from api directory
COPY api/tsconfig.json ./
COPY api/src ./src

# Build TypeScript
RUN ./node_modules/.bin/tsc

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY api/package*.json ./

# Install production dependencies only (disable strict SSL)
RUN npm config set strict-ssl false && \
    npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy schema directory (needed at runtime)
COPY schema /schema

# Create necessary directories
RUN mkdir -p /uploads /data

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
