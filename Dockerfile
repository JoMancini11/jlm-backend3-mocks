# ==============================
# Etapa 1: Construcción
# ==============================
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ==============================
# Etapa 2: Ejecución
# ==============================
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app
COPY . .

# Exponer el puerto que usa tu servidor
EXPOSE 8080

# Comando para ejecutar la app
CMD ["npm", "start"]
