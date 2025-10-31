# Use Node 22 as base image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (for efficient caching)
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose your app's port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]