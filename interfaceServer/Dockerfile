# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server code to the working directory
COPY . .

# Expose the port on which the server will run
EXPOSE 8888

# Start the server
CMD ["npm", "start"]