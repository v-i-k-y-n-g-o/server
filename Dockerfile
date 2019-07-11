FROM node:latest
RUN mkdir -p /usr/src/app
ENV NODE_ENV test

# Create app directory
WORKDIR /usr/src/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install nodemon -g
# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "./app/server.js" ]

# TODO: HACER UN VOLUME PARA LA CARPTECA DE DOCS



#Para crear la imagen
#$ sudo docker build -t blockchain-service .

#$ sudo docker run -p 30315:3000 -d blockchain-service

# Get container ID
#$ docker ps

# Print app output
#$ docker logs <container id>

# Kill container

# Remove image
