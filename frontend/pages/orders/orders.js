import { setupHeader } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

const API_BASE_URL = '/api';

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

async function getOrdersByUserId(userId) {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/sales?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error loading orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Error loading products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function cancelOrder(orderId) {
  const token = sessionStorage.getItem('token');
  
  if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      showNotification('Pedido cancelado exitosamente');
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const orders = await getOrdersByUserId(userData._id);
      const products = await getProducts();
      renderOrders(orders, products);
    } else {
      const errorData = await response.json();
      showNotification(errorData.message || 'Error al cancelar el pedido', true);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    showNotification('Error al cancelar el pedido. Intenta nuevamente.', true);
  }
}

function renderOrders(orders, products) {
  const ordersList = document.getElementById('orders-list');
  
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-orders card text-center py-5 shadow-sm">
        <p class="fs-5">No tienes pedidos aún</p>
        <a href="../home/home.html" class="btn btn-brand-secondary mx-auto">Ir a Comprar</a>
      </div>
    `;
    return;
  }

  const ordersHTML = orders.map(order => `
    <div class="order-card card shadow-sm p-3">
      <div class="order-header d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <h3 class="h5 mb-0 text-primary-brand">Pedido #${order._id}</h3>
        <p class="order-date mb-0 text-muted">${new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      <div class="order-items d-flex flex-column gap-2 mb-3">
        ${order.items.map(item => {
          const product = products.find(p => p._id === item.productId);
          const productName = product ? product.name : `Producto ID: ${item.productId}`;
          return `
            <div class="order-item d-flex justify-content-between align-items-center p-2 bg-light rounded">
              <span class="item-quantity fw-bold text-primary-brand">x${item.quantity}</span>
              <span class="item-name flex-grow-1 mx-3">${productName}</span>
              <span class="item-price fw-bold">$${item.price.toFixed(2)}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="order-total d-flex justify-content-between align-items-center fs-5 border-top pt-3">
        <span>Total:</span>
        <span class="total-amount fw-bold text-primary-brand fs-4">$${order.total.toFixed(2)}</span>
      </div>
      <div class="order-actions text-end border-top pt-3 mt-3">
        <button class="btn btn-outline-danger cancel-order-btn" data-order-id="${order._id}">Cancelar Pedido</button>
      </div>
    </div>
  `).join('');

  ordersList.innerHTML = ordersHTML;
  
  document.querySelectorAll('.cancel-order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-id');
      cancelOrder(orderId);
    });
  });
}

async function init() {
  setupHeader();
  Footer();
  
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    showNotification('Debes iniciar sesión para ver tus pedidos', true);
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
  
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData._id;
  
  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = `
    <div class="loading text-center py-5">
      <div class="spinner-border text-primary-brand" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando pedidos...</p>
    </div>
  `;

  try {
    const [orders, products] = await Promise.all([
      getOrdersByUserId(userId),
      getProducts()
    ]);
    renderOrders(orders, products);
  } catch (error) {
    console.error('Error loading orders:', error);
    ordersList.innerHTML = `
      <p class="alert alert-danger text-center">Error al cargar los pedidos. Por favor, intenta nuevamente más tarde.</p>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
