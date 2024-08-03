# Use a specific Node.js version as the base image
FROM node:20.12.0-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the main configuration files from the root level
COPY package.json package-lock.json turbo.json ./

# Copy the tsconfig.json specifically from the user-app directory
COPY apps/user-app/tsconfig.json ./tsconfig.json

# Copy the rest of the application and package code into the container
COPY apps ./apps
COPY packages ./packages

# Install the dependencies
RUN npm install

# Optionally, if you need to generate your Prisma or database client
RUN npm run db:generate

# Build the user-app (assuming you have a build script for it)
RUN npm run build --filter=user-app

# Start the user-app application
CMD ["npm", "run", "start-user-app"]
