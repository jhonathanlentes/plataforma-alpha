# Usamos Debian Slim en lugar de Alpine para máxima compatibilidad con Prisma/OpenSSL
FROM node:18-slim

# Instalamos OpenSSL necesario para la base de datos
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generamos el cliente de base de datos
RUN npx prisma generate

# Construimos la app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
