export const ProductCard = (product) => {
  const { id, image, name, description, price } = product;
  
  return `
    <div class="card" data-product-id="${id}">
      <div class="card-content">
        <img src="${image}" alt="${name}" onerror="this.src='../../images/product-placeholder.png'">
        <h3>${name}</h3>
        <p class="description">${description}</p>
        <div class="price">$${price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button class="qty-btn decrease" data-product-id="${id}">-</button>
          <input type="number" value="1" min="1" class="qty-input" data-product-id="${id}">
          <button class="qty-btn increase" data-product-id="${id}">+</button>
        </div>
        <button class="add-to-cart" data-product-id="${id}">
          Agregar al carrito
        </button>
      </div>
    </div>
  `;
};