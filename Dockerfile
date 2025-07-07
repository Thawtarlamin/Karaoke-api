FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    git \
    curl

# Install Spleeter
RUN pip install spleeter

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Create app directory
WORKDIR /app

# Copy dependencies & install
COPY package.json ./
RUN npm install

# Copy all source code
COPY . .

# Port expose
EXPOSE 3000

# Start server
CMD ["npm", "start"]
