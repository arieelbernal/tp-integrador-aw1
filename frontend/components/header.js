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
      <li class="nav-item"><a href="${link.href}" class="nav-link${isActive ? ' active' : ''}">${link.label}</a></li>
    `;
  }).join('');

  const cartItem = `
    <li class="nav-item">
      <a href="${cartLink.href}" class="nav-link cart-icon${window.location.pathname.includes(cartLink.href.split('/').pop()) ? ' active' : ''}">
        🛒 <span id="cart-count" class="badge rounded-pill bg-danger">0</span>
      </a>
    </li>
  `;

  const authNavItems = isLoggedIn
    ? `
      <li class="nav-item"><a href="${ordersLink.href}" class="nav-link${window.location.pathname.includes(ordersLink.href.split('/').pop()) ? ' active' : ''}">${ordersLink.label}</a></li>
      <li class="nav-item">
        <button id="logout-btn" class="btn btn-outline-light btn-sm ms-lg-2">Cerrar sesión</button>
      </li>
    `
    : authLinks.map(link => `
      <li class="nav-item"><a href="${link.href}" class="nav-link${window.location.pathname.includes(link.href.split('/').pop()) ? ' active' : ''}">${link.label}</a></li>
    `).join('');

  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-shop fixed-top shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-semibold" href="/pages/home/home.html">Tienda de E-Commerce</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            ${navItems}
            ${authNavItems}
            ${cartItem}
          </ul>
        </div>
      </div>
    </nav>
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
    sessionStorage.removeItem('token');
    localStorage.removeItem('cart');
    window.location.href = '/pages/login/login.html';
  });
}
