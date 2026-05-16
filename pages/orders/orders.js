import { setupHeader } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

const API_BASE_URL = 'http://localhost:3000/api';

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
    const response = await fetch(`${API_BASE_URL}/sales?userId=${userId}`);
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
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData.id;
  
  if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      showNotification('Pedido cancelado exitosamente');
      // Reload orders
      const orders = await getOrdersByUserId(userId);
      const products = await getProducts();
      renderOrders(orders, products);
    } else {
      const errorData = await response.json();
      showNotification(errorData.error || 'Error al cancelar el pedido', true);
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
      <div class="empty-orders">
        <p>No tienes pedidos aún</p>
        <a href="../home/home.html" class="btn-primary">Ir a Comprar</a>
      </div>
    `;
    return;
  }
  
  const ordersHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <h3>Pedido #${order.id}</h3>
        <p class="order-date">${new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      <div class="order-items">
        ${order.items.map(item => {
          const product = products.find(p => p.id === item.productId);
          const productName = product ? product.name : `Producto ID: ${item.productId}`;
          return `
            <div class="order-item">
              <span class="item-quantity">x${item.quantity}</span>
              <span class="item-name">${productName}</span>
              <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="order-total">
        <span>Total:</span>
        <span class="total-amount">$${order.total.toFixed(2)}</span>
      </div>
      <div class="order-actions">
        <button class="cancel-order-btn" data-order-id="${order.id}">Cancelar Pedido</button>
      </div>
    </div>
  `).join('');
  
  ordersList.innerHTML = ordersHTML;
  
  // Add event listeners to cancel buttons
  document.querySelectorAll('.cancel-order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = parseInt(btn.getAttribute('data-order-id'));
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
  
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData.id;
  
  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = '<p class="loading">Cargando pedidos...</p>';
  
  try {
    const [orders, products] = await Promise.all([
      getOrdersByUserId(userId),
      getProducts()
    ]);
    renderOrders(orders, products);
  } catch (error) {
    console.error('Error loading orders:', error);
    ordersList.innerHTML = `
      <div class="error">
        <p>Error al cargar los pedidos. Por favor, intenta nuevamente más tarde.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
