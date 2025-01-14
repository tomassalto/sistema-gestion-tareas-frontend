# Sistema de Gestión de Tareas con Usuarios Múltiples - Frontend

Este es el frontend del Sistema de Gestión de Tareas con Usuarios Múltiples, desarrollado con React, TypeScript y TailwindCSS. Este cliente consume la API proporcionada por el backend.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) >= 16.0
- [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/desktop/setup/install/windows-install/)

## Instalación con XAMPP

1. Crear una carpeta dentro de la carpeta "htdocs" del Xampp. Donde clonaremos el frontend y el backend. Dejo un ejemplo debajo:

   ```bash
   C:/xampp/htdocs/sistema-tareas
   ```

2. Clona el repositorio backend (si aun no lo has hecho):

   ```bash
   git clone https://github.com/tomassalto/gestion-tareas-backend.git

   cd gestion-tareas-backend/gestion-tareas
   ```

3. Clona el repositorio frontend:

   ```bash
   git clone https://github.com/tomassalto/sistema-gestion-tareas-frontend.git

   cd sistema-gestion-tareas-frontend/template-reactjs-modernizacion
   ```

4. Instala las dependencias:

   ```bash
   npm install
   ```

5. Levanta el servidor de desarrollo:

   ```bash
   npm run start
   ```

   El frontend estará disponible en `http://localhost:5173/apps/template/#/examen`.

## Instalación con Docker

1. Iniciar el motor de Docker

2. Clonar repositorio en una nueva carpeta (donde también debe estar el repositorio backend clonado) y cambiar a la rama "docker-container"

   ```bash
   git clone https://github.com/tomassalto/sistema-gestion-tareas-frontend.git

   cd sistema-gestion-tareas-frontend

   git switch docker-container
   ```

3. Una vez hecho esto, y si en el repositorio backend ya realizaste los pasos de clonar el repositorio y cambiar a la rama `docker-container`. Regresar a la carpeta principal donde estan los dos repositorios clonados y ejecutar el comando (cuidado: el readme de backend tiene el mismo paso que este, NO realizar 2 veces):

   ```bash
    docker-compose up --build
   ```
