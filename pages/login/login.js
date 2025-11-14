import { setupHeader } from '../../components/header.js';
import { Footer } from '../../components/footer.js';
import { validateUser } from '../../api/api.js';

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

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  try {
    const result = await validateUser(email, password);
    if (result && result.success) {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userData', JSON.stringify(result.user));

      showNotification('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        window.location.href = '/pages/home/home.html';
      }, 1000);
    } else {
      showNotification(result?.message || 'Credenciales incorrectas', true);
    }
  } catch (error) {
    console.error('Error during login:', error);
    showNotification('Error al iniciar sesión. Intente nuevamente.', true);
  }
}

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    window.location.href = '../home/home.html';
  }
}

function init() {
  checkAuth();
  
  Footer();
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  init();
});
