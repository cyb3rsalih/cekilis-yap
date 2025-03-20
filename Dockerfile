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

# Build the Vite app
RUN yarn build

# Use a smaller production image
FROM node:22.11.0-alpine AS runner

# Set working directory
WORKDIR /app

# Copy required files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Install serve to serve static files
RUN yarn global add serve

# Expose the Vite default port
EXPOSE 5173

# Start the Vite app using serve
CMD ["serve", "-s", "dist", "-l", "5173"]