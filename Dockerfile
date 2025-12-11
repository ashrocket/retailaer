FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose dev server port
EXPOSE 4321

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
