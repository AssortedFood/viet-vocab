# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the entire project (excluding what's in .dockerignore)
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight image to serve the built app
FROM node:20-alpine AS runner

# Set working directory for runtime container
WORKDIR /app

# Copy the built Next.js app from builder stage
COPY --from=builder /app ./

# Expose Next.js port
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "run", "start"]
