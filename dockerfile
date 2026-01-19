FROM node:18-alpine

RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Script pour attendre MySQL avant de lancer l'API
CMD ["sh", "-c", "until nc -z db 3306; do echo '⏳ Waiting for MySQL...'; sleep 2; done; echo 'MySQL is up'; npm run dev"]


