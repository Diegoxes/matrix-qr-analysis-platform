# Usa una imagen base ligera de Node.js
FROM node:22-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3007


CMD ["npm", "run", "start"]

