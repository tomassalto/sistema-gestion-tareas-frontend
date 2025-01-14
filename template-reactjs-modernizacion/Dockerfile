FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos y las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 5173
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "dev"]
