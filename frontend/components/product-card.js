export const ProductCard = (product) => {
  const { _id, image, name, description, price } = product;

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4" data-product-id="${_id}">
      <div class="card h-100 shadow-sm product-card">
        <img src="${image}" class="card-img-top product-card-img" alt="${name}" onerror="this.src='../../images/product-placeholder.png'">
        <div class="card-body d-flex flex-column text-center">
          <h3 class="h6">${name}</h3>
          <p class="card-text text-muted small flex-grow-1">${description}</p>
          <div class="fs-4 fw-bold text-primary-brand mb-2">$${price.toFixed(2)}</div>
          <div class="input-group input-group-sm justify-content-center mb-3 qty-controls">
            <button class="btn btn-outline-secondary qty-btn decrease" type="button" data-product-id="${_id}">-</button>
            <input type="number" value="1" min="1" class="form-control text-center qty-input" data-product-id="${_id}">
            <button class="btn btn-outline-secondary qty-btn increase" type="button" data-product-id="${_id}">+</button>
          </div>
          <button class="btn btn-brand-secondary add-to-cart" data-product-id="${_id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;
};
