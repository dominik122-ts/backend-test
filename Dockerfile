# Use Node.js LTS as base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
