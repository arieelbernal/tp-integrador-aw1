import { setupHeader } from '../../components/header.js';
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

function validateForm(email, password) {
  let isValid = true;
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  
  emailError.style.display = 'none';
  passwordError.style.display = 'none';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.style.display = 'block';
    isValid = false;
  }
  
  if (password.length < 6) {
    passwordError.style.display = 'block';
    isValid = false;
  }
  
  return isValid;
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  if (!validateForm(email, password)) {
    return;
  }
  
  const result = await validateUser(email, password);
  
  if (result.success) {
    showNotification('¡Inicio de sesión exitoso! Redirigiendo...');
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userData', JSON.stringify(result.user));
    
    setTimeout(() => {
      window.location.href = '../home/home.html';
    }, 1500);
  } else {
    showNotification(result.message || 'Credenciales inválidas', true);
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
  
  Navbar();
  Footer();
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const email = emailInput.value.trim();
      const emailError = document.getElementById('email-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email)) {
        emailError.style.display = 'block';
      } else {
        emailError.style.display = 'none';
      }
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const passwordError = document.getElementById('password-error');
      
      if (password && password.length < 6) {
        passwordError.style.display = 'block';
      } else {
        passwordError.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  init();
});
