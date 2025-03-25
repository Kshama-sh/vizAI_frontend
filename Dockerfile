# Use an official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application using serve
# CMD ["npx", "serve", "-s", "build", "-l", "5173"]
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
