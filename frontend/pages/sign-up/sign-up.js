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

async function checkEmailExists(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Error loading users');
    }
    const users = await response.json();
    return users.some(u => u.email === email);
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        address: userData.address || '',
      }),
    });

    if (response.ok) {
      const user = await response.json();
      return {
        success: true,
        user: user
      };
    }

    const errorData = await response.json();
    return {
      success: false,
      message: errorData.message || 'Error al registrar el usuario'
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Error al registrar el usuario'
    };
  }
}

function validateForm(formData) {
  const errors = {};
  let isValid = true;
  
  if (!formData.firstName.trim()) {
    errors.firstName = 'Por favor, ingresa tu nombre';
    isValid = false;
  }
  
  if (!formData.lastName.trim()) {
    errors.lastName = 'Por favor, ingresa tu apellido';
    isValid = false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Por favor, ingresa un correo electrónico válido';
    isValid = false;
  }
  
  if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
    isValid = false;
  }
  
  return { isValid, errors };
}

function showFormErrors(errors) {
  document.querySelectorAll('.error-message').forEach(el => {
    el.style.display = 'none';
  });
  
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  });
}

async function handleSignup(event) {
  event.preventDefault();
  
  const formData = {
    firstName: document.getElementById('first-name').value.trim(),
    lastName: document.getElementById('last-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    confirmPassword: document.getElementById('confirm-password').value
  };
  
  const { isValid, errors } = validateForm(formData);
  
  if (!isValid) {
    showFormErrors(errors);
    return;
  }
  
  const emailExists = await checkEmailExists(formData.email);
  if (emailExists) {
    showNotification('Este correo electrónico ya está registrado', true);
    return;
  }
  
  const userData = {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    password: formData.password
  };
  
  const result = await registerUser(userData);
  
  if (result.success) {
    showNotification('¡Registro exitoso! Redirigiendo...');
    
    setTimeout(() => {
      const { password: _, ...userWithoutPassword } = result.user;
      
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      
      window.location.href = '../home/home.html';
    }, 1500);
  } else {
    showNotification('Error al registrar usuario. Intenta nuevamente.', true);
  }
}

function setupRealTimeValidation() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  
  const firstNameInput = document.getElementById('first-name');
  if (firstNameInput) {
    firstNameInput.addEventListener('input', () => {
      const errorElement = document.getElementById('first-name-error');
      if (firstNameInput.value.trim() === '') {
        errorElement.textContent = 'Por favor, ingresa tu nombre';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    });
  }
  
  const lastNameInput = document.getElementById('last-name');
  if (lastNameInput) {
    lastNameInput.addEventListener('input', () => {
      const errorElement = document.getElementById('last-name-error');
      if (lastNameInput.value.trim() === '') {
        errorElement.textContent = 'Por favor, ingresa tu apellido';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    });
  }
  
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const email = emailInput.value.trim();
      const errorElement = document.getElementById('email-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email)) {
        errorElement.textContent = 'Por favor, ingresa un correo electrónico válido';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    });
  }
  
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const errorElement = document.getElementById('password-error');
      
      if (password && password.length < 6) {
        errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
      
      const confirmPassword = document.getElementById('confirm-password').value;
      if (confirmPassword) {
        const confirmError = document.getElementById('confirm-password-error');
        if (password !== confirmPassword) {
          confirmError.textContent = 'Las contraseñas no coinciden';
          confirmError.style.display = 'block';
        } else {
          confirmError.style.display = 'none';
        }
      }
    });
  }
  
  const confirmPasswordInput = document.getElementById('confirm-password');
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      const password = document.getElementById('password').value;
      const confirmPassword = confirmPasswordInput.value;
      const errorElement = document.getElementById('confirm-password-error');
      
      if (confirmPassword && password !== confirmPassword) {
        errorElement.textContent = 'Las contraseñas no coinciden';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    });
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
  
  setupRealTimeValidation();
  
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  init();
});
