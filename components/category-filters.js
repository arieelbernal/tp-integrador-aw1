function CategoryFilters({ categories = [], onFilterChange = () => {}, currentFilter = 'all' }) {
  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'category-filters';
  
  const handleFilterClick = (e, category) => {
    if (!e || !category) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (category.toLowerCase() === (currentFilter || '').toLowerCase()) {
      return;
    }
    
    onFilterChange(category);
  };
  
  const allCategoriesBtn = document.createElement('button');
  allCategoriesBtn.className = 'filter-btn';
  if (!currentFilter || currentFilter.toLowerCase() === 'all') {
    allCategoriesBtn.classList.add('active');
  }
  allCategoriesBtn.textContent = 'Todas';
  allCategoriesBtn.onclick = (e) => handleFilterClick(e, 'all');
  
  filtersContainer.appendChild(allCategoriesBtn);
  
  if (Array.isArray(categories)) {
    categories.forEach(category => {
      if (!category) return;
      
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      
      if (category.toLowerCase() === (currentFilter || '').toLowerCase()) {
        btn.classList.add('active');
      }
      
      btn.textContent = category;
      btn.onclick = (e) => handleFilterClick(e, category);
      filtersContainer.appendChild(btn);
    });
  }
  
  return filtersContainer;
}

export { CategoryFilters };
