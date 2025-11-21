# Roadmap de Desarrollo y Tecnologías Utilizadas

## 1. Roadmap de Desarrollo

> Nota: Este roadmap está organizado por las etapas de trabajo y alineado con la estructura actual del proyecto.

### 1.1. Entrega 1 – HTML inicial simple
- **Objetivo**: Crear una primera versión muy básica de la aplicación sólo con HTML.
- **Acciones principales**:
  - Inicialización del repositorio Git.
  - Creación de un archivo HTML simple con la estructura mínima de la página principal (simples formularios).
  - Definición de la estructura general de secciones: encabezado, área principal de contenido y pie de página.
- **Resultado**: Una página funcional a nivel de contenido, pero todavía sin estilos ni comportamiento dinámico.

### 1.2. Entrega 2 – Incorporación de estilos CSS
- **Objetivo**: Darle diseño y mejorar la experiencia visual del HTML inicial.
- **Acciones principales**:
  - Creación de la hoja de estilos principal `styles/styles.css`.
  - Definición de variables de color y estilos globales en `:root` y `body` (paleta de colores, tipografías, reseteo de márgenes, fondo, etc.).
  - Maquetado de la página principal (Home) con CSS:
    - `.container` con layout en grid para los productos.
    - `.card` de producto (imagen, título, descripción, precio y distribución interna).
    - `header`, `nav`, `footer` fijos y responsivos.
  - Ajustes iniciales para que la página sea legible en distintos tamaños de pantalla.
- **Resultado**: La aplicación pasa de ser un HTML plano a tener una apariencia de tienda online, aunque todavía sin lógica de carrito.

### 1.3. Entrega 3 – Lógica JavaScript inicial y reestructuración del proyecto
- **Objetivo**: Incorporar la primera capa de comportamiento dinámico y ordenar mejor la estructura del código.
- **Acciones principales**:
  - Implementación de funciones en `home.js` para:
    - Añadir productos al carrito.
    - Actualizar cantidades.
    - Calcular totales.
  - Uso de `localStorage` para persistir el contenido del carrito en el navegador.
  - Reestructuración del proyecto:
    - Organización en carpetas lógicas (`pages/`, `styles/`, etc.).
    - Separación más clara entre HTML, CSS y JS.
    - Limpieza y mejora de la legibilidad del código.
- **Resultado**: La tienda ya tiene un carrito funcional y el proyecto queda mejor organizado para seguir creciendo.

### 1.4. Entrega 4 – Funcionalidades avanzadas
- **Objetivo**: Mejorar la experiencia de usuario con nuevas pantallas y feedback visual.
- **Acciones principales**:
  - Flujo de autenticación (Login/Signup):
    - Creación de las páginas de login y signup (`login-container`, `signup-container` en los estilos).
    - Estilado de formularios con clases como `.form-group`, `.form-row`, `.login-btn`, `.signup-btn`, `.error-message`.
    - Integración visual en el `header` con el nombre del usuario y botón de logout (`.user-name`, `.logout-btn`).
  - Manejo de feedback al usuario con notificaciones/toasts:
    - Implementación de la función `showNotification(message, isError = false)` en `home.js` para mostrar mensajes temporales cuando se realiza una acción importante (por ejemplo, añadir un producto al carrito).
    - Creación y estilado del componente `.notification` en `styles.css` (posición fija, animación de entrada/salida, variantes `success` y `error`).
    - Ajustes posteriores del diseño del toast para que tenga márgenes laterales y buena legibilidad.
- **Resultado**: La aplicación ofrece una experiencia más completa, con autenticación básica y mensajes claros de estado para el usuario.

### 1.5. Entrega 5 – Filtros y pulido final
- **Objetivo**: Facilitar la navegación por el catálogo y dejar la aplicación lista para entrega.
- **Acciones principales**:
  - Implementación de la sección de filtros por categoría (`.category-filters`, `.filter-btn`) y su lógica.
  - Comportamiento para activar/desactivar filtros y actualizar la grilla de productos.
  - Ajustes de spacing, tamaños de fuente y sombras.
  - Corrección de pequeños bugs en el manejo de cantidades, conteo del carrito (`updateCartCount`) y estados de notificación.
- **Resultado**: Versión refinada y lista para presentación/evaluación, con buena usabilidad tanto en escritorio como en dispositivos móviles.

---

## 2. Tecnologías Utilizadas

### 2.1. Frontend (Estructura y Lógica)
- **HTML5**
  - Estructura principal de las páginas (`home`, login, signup, cart).
  - Uso de elementos semánticos: `header`, `main`, `footer`, etc.

- **JavaScript (Vanilla ES6+)**
  - Archivo principal de lógica en `pages/home/home.js` y otros scripts asociados.
  - Manejo del DOM:
    - Creación dinámica de elementos (`document.createElement` para notificaciones y productos).
    - Manejo de eventos (click en botones de "Añadir al carrito", filtros, etc.).
  - Lógica de negocio:
    - Cálculo de totales del carrito.
    - Actualización del contador del carrito (`updateCartCount`).
    - Función `showNotification(message, isError = false)` para feedback al usuario.
  - Persistencia en el lado del cliente con `localStorage`:
    - Guardado y lectura del estado del carrito.

### 2.2. Estilos y Diseño
- **CSS3 puro**
  - Archivo central: `styles/styles.css`.
  - Uso de **CSS Grid** y **Flexbox** para el layout:
    - `.container` para la grilla de productos.
    - `.cart-container` para la distribución de items y resumen del carrito.
    - `.nav-container`, `.category-filters` y otros contenedores flexibles.
  - **Variables CSS** (`:root`):
    - `--primary-color`, `--secondary-color`, `--tertiary-color`, `--text-color`, `--background-color`.
    - Facilitan cambios de paleta y consistencia visual.
  - **Componentes de UI**:
    - Cards de producto (`.card`, `.card .description`, `.card .price`).
    - Controles de cantidad (`.quantity-controls`, `.qty-btn`, `.qty-input`).
    - Botones (`.add-to-cart`, `.login-btn`, `.signup-btn`, `.checkout-btn`, `.btn-primary`).
    - Notificaciones/toasts (`.notification`, `.notification.success`, `.notification.error`, `.notification.show`).
  - **Responsividad**:
    - Media queries en `@media (max-width: 768px)` para adaptar carrito, filtros y layout en móviles.

### 2.3. Gestión de estado local y almacenamiento
- **Web Storage API – localStorage**
  - Uso para almacenar el carrito de compras en el navegador.
  - Permite que el contenido del carrito se mantenga entre recargas y sesiones.

### 2.4. Control de versiones
- **Git**
  - Seguimiento de la evolución del proyecto mediante commits.

---

## 3. Resumen

- El desarrollo se organizó en **varias etapas**: desde la configuración inicial, pasando por maquetado, lógica de carrito, autenticación, filtros y pulido final.
- Se utilizaron **tecnologías web estándar** (HTML5, CSS3, JavaScript vanilla, localStorage).
- El resultado es una aplicación web de ecommerce sencilla pero completa, con carrito persistente, sistema de notificaciones y diseño responsivo.
