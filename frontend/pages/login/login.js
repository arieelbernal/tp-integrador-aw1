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

async function validateUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    }

    const errorData = await response.json();
    return {
      success: false,
      message: errorData.message || 'Credenciales inválidas'
    };
  } catch (error) {
    console.error('Error validating user:', error);
    return {
      success: false,
      message: 'Error al validar el usuario'
    };
  }
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
      sessionStorage.setItem('token', result.token);

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
