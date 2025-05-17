# Usa una imagen base ligera de Node.js
FROM node:22-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3005


CMD ["npm", "run", "start"]

