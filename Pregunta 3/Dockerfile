# Dockerfile

# Imagen base de Node.js (actualizada a una versión más reciente)
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración (package.json, package-lock.json)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar solo la carpeta `server`, `client` y otros archivos necesarios
#COPY ./server ./server
#COPY ./client ./client
COPY ./app ./app

# Exponer el puerto de la aplicación
EXPOSE 3000


# Comando para iniciar la aplicación
CMD ["node", "app/index.js"]
