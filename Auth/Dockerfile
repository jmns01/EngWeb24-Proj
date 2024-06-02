FROM node
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 20242
CMD [ "npm", "start" ]