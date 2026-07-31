# Documentación Técnica

## Qué es esto

Es una tienda online (e-commerce). Tiene carrito de compras, login/registro de usuarios y pedidos.

## Arquitectura

Es un monolito: el backend (Express) sirve tanto la API como los archivos del frontend, todo en el mismo repo y mismo server.

Adentro del backend está separado en capas, más o menos como MVC pero pensado para una API:

- **routes**: define los endpoints y qué función atiende cada uno, no tiene lógica
- **middleware**: cosas que corren antes de llegar a la ruta, como validar el JWT
- **controllers**: agarran el request, llaman al service que corresponda, devuelven la respuesta
- **services**: acá está la lógica de negocio (validaciones, manejo de stock, permisos, etc), no sabe nada de Express
- **models**: los schemas de Mongoose

Cuando un service encuentra un error (algo no existe, datos inválidos, etc) tira un `throw new HttpError(status, message)`. Eso lo agarra el controller con un try/catch y lo manda con `next(err)` a un middleware de errores centralizado (`middleware/errorHandler.js`) que es el único lugar que arma la respuesta final. La respuesta siempre queda con esta forma:

```
{ "error_code": 404, "message": "Producto no encontrado" }
```

El código (nombres de variables, funciones, propiedades) está en inglés. Los valores de `message` que puede llegar a ver el usuario están en español. Lo que es puramente interno (configuración del server, por ejemplo) quedó en inglés también.

## Stack

Backend: Node + Express, MongoDB con Mongoose, JWT para login, bcryptjs para las contraseñas, cors, dotenv.

Frontend: HTML + Bootstrap 5 (por CDN) para los estilos y componentes, JS vanilla (sin framework), localStorage para el carrito.

## Carpetas

```
backend/
  config/       -> conexión a mongo
  models/       -> Product, Sale, User
  services/     -> lógica de negocio
  controllers/  -> conectan las routes con los services
  routes/       -> los endpoints
  middleware/   -> auth (jwt) y el error handler
  utils/        -> HttpError
  index.js      -> arranca todo

frontend/
  components/   -> header, footer, product-card, category-filters
  pages/        -> home, login, sign-up, cart, orders (cada una con su html/js)
  styles/       -> styles.css
  images/
```

## Endpoints

Usuarios (`/api/users`):
- GET / y GET /:id -> listar/traer usuarios
- POST / -> registro
- POST /login -> login, devuelve user + token
- PUT /:id -> actualizar
- DELETE /:id -> borrar (falla si tiene ventas asociadas)

Productos (`/api/products`):
- GET / (con ?category= opcional) y GET /:id
- POST / -> crear
- PUT /:id -> actualizar
- DELETE /:id -> borrar (falla si tiene ventas asociadas)

Ventas (`/api/sales`), todas piden token:
- GET / (con ?userId= opcional) y GET /:id
- POST / -> crea la venta, valida y descuenta stock
- PUT /:id -> actualiza items/total, recalcula stock
- DELETE /:id -> cancela (repone stock, no borra el registro)

## Modelos

User: name, email (único), password (hasheada), phone, address, active, createdAt

Product: name, description, image, price, stock, category (enum limitado a unas categorías)

Sale: userId (ref a User), items (array de {productId, quantity, price}), total, active, createdAt

## Manejo de errores

Todo pasa por el mismo lugar. Un ejemplo con el login:

1. `users.routes.js` recibe el POST /login
2. el controller lee el body y llama a `usersService.loginUser(...)`
3. si el mail no existe o la contraseña no matchea, el service tira `new HttpError(401, 'Correo electrónico o contraseña inválidos')`
4. el controller hace `catch(err) { next(err) }`
5. el middleware de errores arma `{ error_code: 401, message: '...' }` y responde

Ese mismo camino se usa para todo: rutas que no existen (404), JSON mal formado (400), ids inválidos de Mongo (400), etc. Nadie arma una respuesta de error "a mano" en otro lado.

## Variables de entorno

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=alguna-clave-secreta
```

(están con más detalle en el README, ahí también están los pasos para levantar el proyecto)

## Cosas que tiene

- login/registro, contraseñas hasheadas, JWT
- CRUD de productos y de ventas
- no te deja borrar un producto o usuario si tiene ventas asociadas
- carrito persistente en localStorage, filtros por categoría
- responsive, con notificaciones tipo toast

## Notas

- No hay frontend de administración para productos/usuarios, esos endpoints existen en la API pero no se usan desde ninguna pantalla todavía
- El JWT_SECRET del middleware no configurado devuelve 500 en inglés a propósito, es un error de config que nunca debería ver un usuario real

## Autor

Ariel Hernán Rodriguez Bernal
