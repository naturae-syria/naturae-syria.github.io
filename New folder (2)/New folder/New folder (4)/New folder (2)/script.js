
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('search');
const brandFilter = document.getElementById('brandFilter');
const lineFilter = document.getElementById('lineFilter');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const unique = (arr, key) => [...new Set(arr.map(item => item[key]).filter(Boolean))];

function populateCategoryFilter() {
  unique(products, 'category').forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function updateBrandFilter() {
  const selectedCategory = categoryFilter.value;
  let filtered = products;
  if (selectedCategory) {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  brandFilter.innerHTML = '<option value="">🏷️ كل العلامات التجارية</option>';
  unique(filtered, 'brand').forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    brandFilter.appendChild(opt);
  });
}

function updateLineFilter() {
  const selectedCategory = categoryFilter.value;
  const selectedBrand = brandFilter.value;
  let filtered = products;

  if (selectedCategory) {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  if (selectedBrand) {
    filtered = filtered.filter(p => p.brand === selectedBrand);
  }

  lineFilter.innerHTML = '<option value="">🧵 كل الخطوط</option>';
  unique(filtered, 'line').forEach(line => {
    const opt = document.createElement('option');
    opt.value = line;
    opt.textContent = line;
    lineFilter.appendChild(opt);
  });
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedBrand = brandFilter.value;
  const selectedLine = lineFilter.value;
  const selectedCategory = categoryFilter.value;

  grid.innerHTML = '';
  products.filter(p => {
    return (!searchTerm || p.name.toLowerCase().includes(searchTerm)) &&
           (!selectedBrand || p.brand === selectedBrand) &&
           (!selectedLine || p.line === selectedLine) &&
           (!selectedCategory || p.category === selectedCategory);
  }).forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/250'}" alt="${p.name}" class="product-img-small">
      <h3>${p.name}</h3>
      <div class="tags">
        <span class="tag">${p.brand || ''}</span>
        <span class="tag">${p.line || ''}</span>
        <span class="tag">${p.category || ''}</span>
      </div>
    `;
    card.onclick = () => showModal(p);
    grid.appendChild(card);
  });
}


function showModal(product) {
  modalBody.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-img-large">
    <h2>${product.name}</h2>
    <p><strong>الفئة:</strong> ${product.category}</p>
    <p><strong>الوصف:</strong> ${product.description}</p>
    <p><strong>طريقة الاستخدام:</strong> ${product.usage}</p>
    <p><strong>الشرح:</strong> ${product.explanation}</p>
  `;
  modal.style.display = 'flex';
}


closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', renderProducts);

categoryFilter.addEventListener('change', () => {
  updateBrandFilter();
  updateLineFilter();
  renderProducts();
});

brandFilter.addEventListener('change', () => {
  updateLineFilter();
  renderProducts();
});

lineFilter.addEventListener('change', renderProducts);

populateCategoryFilter();
updateBrandFilter();
updateLineFilter();
renderProducts();
