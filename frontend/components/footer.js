export function Footer() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  
  const currentYear = new Date().getFullYear();

  footer.className = 'footer-shop text-white text-center py-3';
  footer.innerHTML = `
    <p class="mb-0">&copy; ${currentYear} Tienda de E-Commerce. Todos los derechos reservados.</p>
  `;
}
