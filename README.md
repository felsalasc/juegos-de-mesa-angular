# NortLAB - Juegos de Mesa Educativos

Aplicación web desarrollada con **Angular 21** para la gestión de un catálogo de juegos de mesa educativos inspirados en las culturas del norte de Chile.

El proyecto implementa una arquitectura basada en componentes Standalone, Formularios Reactivos y consumo de una API REST simulada mediante **JSON Server**.

---

# Tecnologías utilizadas

- Angular 21
- TypeScript
- HTML5
- CSS3
- Angular Router
- Reactive Forms
- HttpClient
- JSON Server (API REST)
- Docker
- Nginx

---

# Funcionalidades

## Usuarios

- Inicio de sesión
- Registro de usuarios
- Recuperación de contraseña
- Perfil de usuario

## Catálogo

- Listado de productos
- Detalle de productos
- Carrito de compras
- Historial de compras

## Administración

- CRUD de productos
- CRUD de usuarios

---

# Arquitectura

La aplicación utiliza una arquitectura por capas:

```
Componentes
      │
      ▼
Servicios (HttpClient)
      │
      ▼
API REST (JSON Server)
      │
      ▼
db.json
```

Toda la información se consume mediante servicios Angular.

---

# API REST

La API se encuentra simulada utilizando **JSON Server**.

Endpoints disponibles:

```
GET    /productos
POST   /productos
PUT    /productos/:id
DELETE /productos/:id

GET    /usuarios
POST   /usuarios
PUT    /usuarios/:id
DELETE /usuarios/:id

GET    /compras
POST   /compras
DELETE /compras/:id
```

---

# Ejecución en desarrollo

Instalar dependencias

```bash
npm install
```

Levantar Angular

```bash
ng serve
```

Levantar la API

```bash
npx json-server --watch db.json --port 3001
```

La aplicación estará disponible en:

```
http://localhost:4200
```

La API REST estará disponible en:

```
http://localhost:3001
```

---

# Construcción

Generar la versión de producción

```bash
ng build
```

Los archivos compilados se almacenan en:

```
dist/juegos-de-mesa-angular/browser
```

---

# Docker

Construir la imagen

```bash
docker build -t nortlab-angular .
```

Ejecutar el contenedor

```bash
docker run -d --name nortlab -p 8080:80 nortlab-angular
```

La aplicación quedará disponible en:

```
http://localhost:8080
```

---

# Docker Compose

Para ejecutar Angular y la API REST mediante Docker:

```bash
docker compose up --build
```

Servicios disponibles

```
Angular
http://localhost:8080

API REST
http://localhost:3001
```

---

# Estructura del proyecto

```
src/
│
├── app/
│   ├── models/
│   ├── services/
│   ├── pages/
│   │   ├── admin/
│   │   ├── productos/
│   │   ├── carrito/
│   │   ├── login/
│   │   ├── registro/
│   │   ├── perfil/
│   │   └── mis-compras/
│   └── app.routes.ts
│
├── assets/
│
db.json
Dockerfile
Dockerfile.api
docker-compose.yml
nginx.conf
```

---

# Autor

**Felipe Salas Cordero**

Proyecto desarrollado para la asignatura **Desarrollo Full Stack II** – Duoc UC.