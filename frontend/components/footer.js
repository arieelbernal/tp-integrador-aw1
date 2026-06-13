export function Footer() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  
  const currentYear = new Date().getFullYear();
  
  footer.innerHTML = `
    <p>&copy; ${currentYear} Tienda de E-Commerce. Todos los derechos reservados.</p>
  `;
}
