FROM node:14

WORKDIR /dentist
COPY package.json .
RUN npm install
COPY . .
CMD npm start