FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Install serve and serve the production build
RUN npm install -g serve
CMD [ "serve", "-s", "build" ]

EXPOSE 5000
