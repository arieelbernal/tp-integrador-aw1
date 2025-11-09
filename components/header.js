export function renderHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  
  header.innerHTML = `
    <div class="nav-container">
      <h1>Tienda de E-Commerce</h1>
      <nav>
        <ul>
          <li><a href="/pages/home/home.html" class="${window.location.pathname.includes('home.html') ? 'active' : ''}">Inicio</a></li>
          <li><a href="/pages/login/login.html" class="${window.location.pathname.includes('login.html') ? 'active' : ''}">Iniciar Sesión</a></li>
          <li><a href="/pages/sign-up/sign-up.html" class="${window.location.pathname.includes('sign-up.html') ? 'active' : ''}">Registrarse</a></li>
          <li>
            <a href="/pages/cart/cart.html" class="cart-icon ${window.location.pathname.includes('cart.html') ? 'active' : ''}">
              🛒 <span id="cart-count">0</span>
            </a>
          </li>
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
  setInterval(updateCartCount, 1000);
}
