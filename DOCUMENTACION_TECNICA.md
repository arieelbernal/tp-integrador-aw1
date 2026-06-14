# Documentación Técnica - TP Integrador AW1

## Descripción del Proyecto

Aplicación de e-commerce desarrollada como trabajo práctico integrador para la materia AW1. El proyecto consiste en una tienda online con funcionalidades completas de carrito de compras, autenticación de usuarios y gestión de pedidos.

---

## Arquitectura del Sistema

### Tipo de Arquitectura
**Monolítica** - Backend y frontend en el mismo repositorio, servidos por el mismo servidor Express.

---

## Stack Tecnológico

### Backend
- **Node.js** - Runtime environment
- **Express** - Framework web para el servidor API
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (JSON Web Token)** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5** - Estructura semántica de las páginas
- **CSS3** - Estilos con Grid y Flexbox
- **JavaScript Vanilla (ES6+)** - Lógica del cliente sin frameworks
- **localStorage** - Persistencia del carrito en el navegador
- **Web Storage API** - Almacenamiento local del cliente

---

## Estructura de Directorios

```
tp-integrador-aw1/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración y conexión a MongoDB
│   ├── models/                  # Modelos de datos Mongoose
│   │   ├── Product.js           # Modelo de producto
│   │   ├── Sale.js              # Modelo de venta/pedido
│   │   └── User.js              # Modelo de usuario
│   ├── routes/                  # Definición de rutas API
│   │   ├── products.routes.js   # Endpoints de productos
│   │   ├── sales.routes.js      # Endpoints de ventas
│   │   └── users.routes.js      # Endpoints de usuarios
│   ├── middleware/              # Middleware de autenticación
│   ├── scripts/                 # Scripts de utilidades
│   └── index.js                 # Punto de entrada del servidor
├── frontend/
│   ├── components/              # Componentes JavaScript reutilizables
│   │   ├── header.js            # Componente de encabezado
│   │   ├── footer.js            # Componente de pie de página
│   │   ├── product-card.js      # Componente de tarjeta de producto
│   │   └── category-filters.js  # Componente de filtros por categoría
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── home/                # Página principal
│   │   ├── login/               # Página de inicio de sesión
│   │   ├── sign-up/             # Página de registro
│   │   ├── cart/                # Página del carrito
│   │   └── orders/              # Página de pedidos
│   ├── styles/
│   │   └── styles.css           # Hoja de estilos global
│   └── images/                  # Imágenes de productos
├── .env                         # Variables de entorno (no versionado)
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts del proyecto
├── package-lock.json            # Lock de dependencias
├── README.md                    # Información del proyecto
└── ROADMAP.md                   # Roadmap de desarrollo
```

---

## API Endpoints

### Usuarios (`/api/users`)
- `POST /register` - Registro de nuevo usuario
- `POST /login` - Inicio de sesión
- `GET /profile` - Obtener perfil del usuario (requiere autenticación)
- `PUT /profile` - Actualizar perfil del usuario (requiere autenticación)

### Productos (`/api/products`)
- `GET /` - Obtener todos los productos
- `GET /:id` - Obtener un producto por ID
- `POST /` - Crear nuevo producto (requiere autenticación)
- `PUT /:id` - Actualizar producto (requiere autenticación)
- `DELETE /:id` - Eliminar producto (requiere autenticación)

### Ventas (`/api/sales`)
- `POST /` - Crear nueva venta/pedido
- `GET /` - Obtener todas las ventas (requiere autenticación)
- `GET /:id` - Obtener venta por ID (requiere autenticación)
- `GET /user/:userId` - Obtener ventas de un usuario (requiere autenticación)

---

## Modelos de Datos

### User
```javascript
{
  username: String,
  email: String,
  password: String (encriptada con bcrypt),
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number
}
```

### Sale
```javascript
{
  user: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: String,
  createdAt: Date
}
```

---

## Flujo de Datos

### Autenticación
1. El usuario se registra o inicia sesión
2. El backend valida las credenciales
3. Si son válidas, genera un token JWT
4. El token se almacena en el cliente (localStorage)
5. El token se envía en el header de las peticiones subsiguientes
6. El middleware verifica el token en cada ruta protegida

### Carrito de Compras
1. Los productos se añaden al carrito en el frontend
2. El estado del carrito se persiste en localStorage
3. Al finalizar la compra, se envía la orden al backend
4. El backend crea el registro de venta en MongoDB

### Gestión de Productos
1. Los productos se muestran en la página principal
2. Se pueden filtrar por categoría
3. Los detalles se cargan dinámicamente desde la API
4. Los cambios se reflejan en tiempo real

---

## Scripts Disponibles

```json
{
  "start": "node backend/index.js",           // Inicia el servidor en producción
  "dev": "node --watch backend/index.js"      // Inicia el servidor con watch mode
}
```

---

## Variables de Entorno

```env
PORT=3000                    // Puerto del servidor
MONGODB_URI=mongodb://localhost:27017/ecommerce  // URI de conexión a MongoDB
JWT_SECRET=your_secret_key   // Clave secreta para JWT
```

---

## Características Principales

### Funcionalidades del Usuario
- Registro e inicio de sesión
- Perfil de usuario
- Historial de pedidos

### Funcionalidades de Compra
- Catálogo de productos
- Carrito de compras persistente
- Filtros por categoría
- Proceso de checkout
- Gestión de cantidades

### Experiencia de Usuario
- Diseño responsivo (móvil y escritorio)
- Notificaciones/toasts para feedback
- Navegación intuitiva
- Interfaz moderna y limpia

---

## Seguridad

- Contraseñas encriptadas con bcryptjs
- Autenticación basada en tokens JWT
- Middleware de autenticación en rutas protegidas
- CORS configurado para permitir peticiones del frontend
- Variables de entorno para datos sensibles

---

## Tecnologías de Desarrollo

### Control de Versiones
- **Git** - Sistema de control de versiones

### Gestión de Paquetes
- **npm** - Gestor de paquetes de Node.js

### Base de Datos
- **MongoDB** - Base de datos NoSQL
- **MongoDB Compass** - Interfaz gráfica para MongoDB (opcional)

---

## Requisitos del Sistema

### Para Desarrollo
- Node.js (v14 o superior)
- npm (v6 o superior)
- MongoDB (v4.4 o superior)

### Para Producción
- Servidor con Node.js
- MongoDB en producción (MongoDB Atlas o instancia propia)
- Variables de entorno configuradas

---

## Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tp-integrador-aw1
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar MongoDB**
   ```bash
   # Asegúrate de que MongoDB esté corriendo
   ```

5. **Ejecutar el servidor**
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**
   ```
   http://localhost:3000
   ```

---

## Notas Adicionales

- El proyecto sigue una arquitectura monolítica por simplicidad
- El frontend no utiliza frameworks de JavaScript, solo vanilla JS
- El carrito se mantiene en localStorage para persistencia entre sesiones

---

## Autor

**Ariel Hernán Rodriguez Bernal**
- Trabajo Práctico Integrador - AW1
- Instituto de Educación Superior
