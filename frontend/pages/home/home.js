import { setupHeader } from '../../components/header.js';
import { Footer } from '../../components/footer.js';
import { ProductCard } from '../../components/product-card.js';
import { CategoryFilters } from '../../components/category-filters.js';

const API_BASE_URL = 'http://localhost:3000/api';

let products = [];
let currentFilter = 'all';

function renderProducts(productsToRender = products, category = currentFilter) {
  const mainContent = document.getElementById('main-content');
  
  if (!Array.isArray(productsToRender)) {
    console.error('productsToRender no es un array:', productsToRender);
    productsToRender = [];
  }

  let filteredProducts = [...productsToRender];
  if (category && category.toLowerCase() !== 'all') {
    filteredProducts = productsToRender.filter(product => 
      product && 
      product.category && 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  mainContent.innerHTML = `
    <div class="container">
      <h1 class="page-title">Productos</h1>
      <div id="filters-container" class="filters-container"></div>
      <div class="row" id="products-container">
        ${filteredProducts.length === 0 ?
          '<p class="no-products text-center">No se encontraron productos en esta categoría.</p>' :
          filteredProducts.map(product => ProductCard(product)).join('')}
      </div>
    </div>
  `;
  
  const filtersContainer = document.getElementById('filters-container');
  if (filtersContainer) {
    const categories = [...new Set(productsToRender
      .map(p => p?.category)
      .filter(Boolean)
    )];
    
    const filters = CategoryFilters({
      categories,
      currentFilter: category,
      onFilterChange: (selectedCategory) => {
        currentFilter = selectedCategory;
        renderProducts(products, selectedCategory);
      }
    });
    
    filtersContainer.appendChild(filters);
  }
  
  const validateAndAdjustInput = (input) => {
    let value = parseInt(input.value) || 1;
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    input.value = value;
    return value;
  };

  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('input', (e) => {
      if (e.target.value === '') return;
      validateAndAdjustInput(e.target);
    });

    input.addEventListener('blur', (e) => {
      if (e.target.value === '') {
        e.target.value = '1';
      } else {
        validateAndAdjustInput(e.target);
      }
    });
  });

  document.querySelectorAll('.qty-btn.increase').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const input = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
      if (input) {
        const current = validateAndAdjustInput(input);
        input.value = current + 1;
      }
    });
  });

  document.querySelectorAll('.qty-btn.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const input = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
      if (input) {
        const current = validateAndAdjustInput(input);
        input.value = Math.max(1, current - 1);
      }
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = button.getAttribute('data-product-id');
      const input = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
      const quantity = input ? parseInt(input.value) || 1 : 1;
      addToCart(productId, quantity);
    });
  });
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p._id === productId);
  if (!product) return;
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item._id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`¡${product.name} añadido al carrito!`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
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

async function init() {
  setupHeader();
  Footer();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="container">
        <h1 class="page-title">Productos</h1>
        <div class="loading text-center py-5">
          <div class="spinner-border text-primary-brand" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando productos...</p>
        </div>
      </div>
    `;
  }

  try {
    products = await getProducts();
    renderProducts(products);
    updateCartCount();
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    mainContent.innerHTML = `
      <div class="container">
        <h1 class="page-title">Productos</h1>
        <p class="alert alert-danger text-center">
          Error al cargar los productos. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
