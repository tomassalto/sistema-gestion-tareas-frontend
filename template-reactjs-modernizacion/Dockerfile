FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de npm y ejecuta npm install
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto 5173
EXPOSE 5173

# Asegúrate de que el comando 'vite' esté disponible
RUN npx vite --version

# Comando de inicio
CMD ["npm", "run", "dev"]
