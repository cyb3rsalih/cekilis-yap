# Use Node.js v22.11.0 as base image
FROM node:22.11.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the Next.js app
RUN yarn build

# Use a smaller production image
FROM node:22.11.0-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app ./

# Expose the Next.js default port
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]