
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y ffmpeg build-essential git curl

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Spleeter
RUN pip install spleeter

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
