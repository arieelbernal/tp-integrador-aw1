function CategoryFilters({ categories = [], onFilterChange = () => {}, currentFilter = 'all' }) {
  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'category-filters d-flex flex-wrap justify-content-center gap-2 my-4';

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
  allCategoriesBtn.className = 'btn btn-sm rounded-pill filter-btn';
  allCategoriesBtn.classList.add(
    !currentFilter || currentFilter.toLowerCase() === 'all' ? 'btn-brand-tertiary' : 'btn-outline-brand-tertiary'
  );
  allCategoriesBtn.textContent = 'Todas';
  allCategoriesBtn.onclick = (e) => handleFilterClick(e, 'all');

  filtersContainer.appendChild(allCategoriesBtn);

  if (Array.isArray(categories)) {
    categories.forEach(category => {
      if (!category) return;

      const isActive = category.toLowerCase() === (currentFilter || '').toLowerCase();
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm rounded-pill filter-btn';
      btn.classList.add(isActive ? 'btn-brand-tertiary' : 'btn-outline-brand-tertiary');

      btn.textContent = category;
      btn.onclick = (e) => handleFilterClick(e, category);
      filtersContainer.appendChild(btn);
    });
  }
  
  return filtersContainer;
}

export { CategoryFilters };
