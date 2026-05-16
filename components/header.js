const navLinks = [
  { href: '/pages/home/home.html', label: 'Inicio' }
];

const cartLink = { href: '/pages/cart/cart.html', label: 'Carrito', isCart: true };

const ordersLink = { href: '/pages/orders/orders.html', label: 'Mis Pedidos' };

const authLinks = [
  { href: '/pages/sign-up/sign-up.html', label: 'Registrarse' },
  { href: '/pages/login/login.html', label: 'Iniciar sesión' }
];

export function renderHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  const navItems = navLinks.map(link => {
    const isActive = window.location.pathname.includes(link.href.split('/').pop());
    return `
      <li><a href="${link.href}" class="${isActive ? 'active' : ''}">${link.label}</a></li>
    `;
  }).join('');

  const cartItem = `
    <li>
      <a href="${cartLink.href}" class="cart-icon ${window.location.pathname.includes(cartLink.href.split('/').pop()) ? 'active' : ''}">
        🛒 <span id="cart-count">0</span>
      </a>
    </li>
  `;

  const authNavItems = isLoggedIn 
    ? `
      <li><a href="${ordersLink.href}" class="${window.location.pathname.includes(ordersLink.href.split('/').pop()) ? 'active' : ''}">${ordersLink.label}</a></li>
      <li>
        <button id="logout-btn" class="logout-btn">Cerrar sesión</button>
      </li>
    `
    : authLinks.map(link => `
      <li><a href="${link.href}" class="${window.location.pathname.includes(link.href.split('/').pop()) ? 'active' : ''}">${link.label}</a></li>
    `).join('');

  header.innerHTML = `
    <div class="nav-container">
      <h1>Tienda de E-Commerce</h1>
      <nav>
        <ul>
          ${navItems}
          ${authNavItems}
          ${cartItem}
        </ul>
      </nav>
    </div>
  `;

  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

export function setupHeader() {
  renderHeader();
  setupLogoutButton();
  setInterval(updateCartCount, 1000);
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('cart');
    window.location.href = '/pages/login/login.html';
  });
}