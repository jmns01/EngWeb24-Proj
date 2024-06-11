FROM node
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 6666
CMD [ "npm", "start" ]