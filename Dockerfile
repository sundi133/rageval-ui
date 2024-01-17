# Stage 1: Build Next.js application
FROM node:18-alpine as builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
