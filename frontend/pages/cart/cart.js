import { setupHeader } from '../../components/header.js';

const API_BASE_URL = 'http://localhost:3000/api';

let cart = [];

function loadCart() {
  const cartData = localStorage.getItem('cart');
  cart = cartData ? JSON.parse(cartData) : [];
  return cart;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart text-center py-5">
        <p class="fs-5">Tu carrito está vacío</p>
        <a href="../home/home.html" class="btn btn-brand-secondary">Ir a Comprar</a>
      </div>
    `;
    updateSummary();
    return;
  }

  const itemsHTML = cart.map(item => `
    <div class="cart-item row gx-3 gy-2 align-items-center py-3 border-bottom" data-product-id="${item._id}">
      <div class="item-image col-4 col-sm-2">
        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}" onerror="this.src='../../images/product-placeholder.png'">
      </div>
      <div class="item-details col-8 col-sm-4">
        <h3 class="h6 mb-1">${item.name}</h3>
        <p class="item-price mb-0">$${item.price.toFixed(2)}</p>
      </div>
      <div class="item-quantity col-6 col-sm-3">
        <div class="input-group input-group-sm">
          <button class="btn btn-outline-secondary qty-btn decrease" type="button" data-product-id="${item._id}">-</button>
          <input type="number" value="${item.quantity}" min="1" class="form-control text-center qty-input" data-product-id="${item._id}" readonly>
          <button class="btn btn-outline-secondary qty-btn increase" type="button" data-product-id="${item._id}">+</button>
        </div>
      </div>
      <div class="item-total col-4 col-sm-2 text-sm-end fw-bold">
        <p class="mb-0">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div class="col-2 col-sm-1 text-end">
        <button class="btn btn-sm btn-danger rounded-circle remove-item" data-product-id="${item._id}">
          <span>✕</span>
        </button>
      </div>
    </div>
  `).join('');

  cartItemsContainer.innerHTML = itemsHTML;
  
  addEventListeners();
  updateSummary();
}

function addEventListeners() {
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      updateQuantity(productId, 1);
    });
  });
  
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      updateQuantity(productId, -1);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      removeItem(productId);
    });
  });
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i._id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeItem(productId);
    } else {
      saveCart();
      renderCartItems();
    }
  }
}

function removeItem(productId) {
  cart = cart.filter(item => item._id !== productId);
  saveCart();
  renderCartItems();
  showNotification('Producto eliminado del carrito');
}

function updateSummary() {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10.00 : 0;
  const total = subtotal + shipping;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'error' : 'success'}`;
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

async function handleCheckout() {
  if (cart.length === 0) {
    showNotification('Tu carrito está vacío', true);
    return;
  }
  
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    showNotification('Debes iniciar sesión para continuar', true);
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 2000);
    return;
  }
  
  const token = sessionStorage.getItem('token');
  if (!token) {
    showNotification('Sesión expirada. Inicia sesión nuevamente', true);
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 2000);
    return;
  }
  
  const items = cart.map(item => ({
    productId: item._id,
    quantity: item.quantity,
    price: item.price
  }));
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  showNotification('Procesando tu pedido...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ items, total }),
    });

    if (response.ok) {
      cart = [];
      saveCart();
      
      showNotification('¡Pedido realizado con éxito!');
      
      setTimeout(() => {
        window.location.href = '../home/home.html';
      }, 2000);
    } else {
      const errorData = await response.json();
      showNotification(errorData.message || 'Error al procesar el pedido', true);
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    showNotification('Error al procesar el pedido. Intenta nuevamente.', true);
  }
}

function init() {
  setupHeader();
  
  loadCart();
  renderCartItems();
  updateSummary();
  addEventListeners();
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

document.addEventListener('DOMContentLoaded', init);
