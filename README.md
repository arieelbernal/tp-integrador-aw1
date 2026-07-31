# E-Commerce Project

## Alumno
### Nombre
##### Ariel Hernan

### Apellido
##### Rodriguez Bernal

## Como levantar el proyecto

Necesitas tener Node instalado y una base de Mongo.

Pasos:

1. npm install
2. copiar el .env.example y renombrarlo a .env
3. completar las variables (ver abajo)
4. npm start (o npm run dev si queres que reinicie solo con los cambios)

Con eso ya te levanta en http://localhost:3000, ahi mismo sirve el front y la api.

## Variables de entorno

Van en el .env, estas son las que usa el proyecto (los valores son solo ejemplos, poné los tuyos):

PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=clave-secreta-jwt

PORT es el puerto del server, MONGODB_URI la conexion a la base, y JWT_SECRET una clave para firmar los tokens de login.

## Dato

Si queres cargar datos de prueba (usuarios/productos/ventas de ejemplo) hay un script en backend/scripts/migrate.js, se corre con:

node backend/scripts/migrate.js
