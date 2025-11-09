import { getProducts } from '../../api/api.js';
import { setupHeader } from '../../components/header.js';

let products = [];

function renderFooter() {
  const footer = document.getElementById('main-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="footer-content">
        <p>&copy; ${new Date().getFullYear()} Tienda de E-Commerce. Todos los derechos reservados.</p>
      </div>
    `;
  }
}

function renderProducts(productsToRender = products) {
  const mainContent = document.getElementById('main-content');
  
  if (productsToRender.length === 0) {
    mainContent.innerHTML = `
      <h1 class="page-title">Productos Destacados</h1>
      <div class="container">
        <p class="no-products">No se encontraron productos.</p>
      </div>
    `;
    return;
  }
  
  const productsHTML = `
    <h1 class="page-title">Productos Destacados</h1>
    <div class="container" id="products-container">
      ${productsToRender.map(product => `
        <div class="card" data-product-id="${product.id}">
          <div class="card-content">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../../images/product-placeholder.png'">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-product-id="${product.id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  mainContent.innerHTML = productsHTML;
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(button.getAttribute('data-product-id'));
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`¡${product.name} añadido al carrito!`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

async function init() {
  setupHeader();
  renderFooter();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
      <h1 class="page-title">Productos Destacados</h1>
      <div class="container">
        <p class="loading">Cargando productos...</p>
      </div>
    `;
  }
  
  try {
    products = await getProducts();
    renderProducts(products);
    updateCartCount();
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    mainContent.innerHTML = `
      <h1 class="page-title">Productos Destacados</h1>
      <div class="container">
        <p class="error">
          Error al cargar los productos. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
