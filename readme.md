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
   git clone https://github.com/tomassalto/sistema-gestion-tareas-backend.git

   cd sistema-gestion-tareas-backend/gestion-tareas
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

4. Ingresar a la URL: `http://localhost:5173/apps/template/#/register` para realizar las funcionalidades del sitio.

5. Para poder ingresar a los usuarios creados automaticamente por las seeders de Laravel, abrir MySQL Workbench por ejemplo y crear una nueva conexión con los datos de la imagen, la contraseña es `password`.

   [![image.png](https://i.postimg.cc/RCGR5nK3/image.png)](https://postimg.cc/hhzxVvCg)

6. Buscar la tabla `users`. El primer registro creado tendrá el rol de usuario administrador y los 9 restantes tendra el rol de usuario estandar.

## Paquetes Principales

- **React:** Librería para la construcción de interfaces.
- **TypeScript:** Superconjunto de JavaScript con tipado estático.
- **TailwindCSS:** Framework CSS para diseño rápido y eficiente.

## Funcionalidades

Sistema de Login

[![image.png](https://i.postimg.cc/vHqDv9cM/image.png)](https://postimg.cc/QH7X8FQn)

Sistema de Registro

[![image.png](https://i.postimg.cc/g0RJdT4k/image.png)](https://postimg.cc/1gmPrMLL)

Vista de usuario administrador
[![image.png](https://i.postimg.cc/nVTShw92/image.png)](https://postimg.cc/kD6vjscR)

Crear tarea
[![image.png](https://i.postimg.cc/cLtFTx9k/image.png)](https://postimg.cc/qN0cvTd2)

Ver progreso de tarea

[![image.png](https://i.postimg.cc/2SLjFKsF/image.png)](https://postimg.cc/VJ1czDLd)

Editar tarea usuario administrador
[![image.png](https://i.postimg.cc/8ChtQyVh/image.png)](https://postimg.cc/Nyj1RkFM)

Vista de usuario estandard

[![image.png](https://i.postimg.cc/ZRx5vv1G/image.png)](https://postimg.cc/Fd142zFp)

Editar tarea usuario estandard

[![image.png](https://i.postimg.cc/kMw5n8N8/image.png)](https://postimg.cc/t7ZbksMC)
