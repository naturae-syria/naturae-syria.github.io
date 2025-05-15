
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('search');
const brandFilter = document.getElementById('brandFilter');
const lineFilter = document.getElementById('lineFilter');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const unique = (arr, key) => [...new Set(arr.map(item => item[key]).filter(Boolean))];

function populateFilters() {
  const filters = [brandFilter, lineFilter, categoryFilter];
  filters.forEach(filter => filter.innerHTML = '');
  const defaultOptions = [
    '<option value="">🏷️ كل العلامات التجارية</option>',
    '<option value="">🧵 كل الخطوط</option>',
    '<option value="">📂 كل الفئات</option>',
  ];
  filters.forEach((filter, idx) => filter.innerHTML = defaultOptions[idx]);

  unique(products, 'brand').forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    brandFilter.appendChild(opt);
  });

  unique(products, 'line').forEach(line => {
    const opt = document.createElement('option');
    opt.value = line;
    opt.textContent = line;
    lineFilter.appendChild(opt);
  });

  unique(products, 'category').forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedBrand = brandFilter.value;
  const selectedLine = lineFilter.value;
  const selectedCategory = categoryFilter.value;

  grid.innerHTML = '';
  products.filter(p => {
    const nameMatch = (p.name && p.name.toLowerCase().includes(searchTerm)) ||
                      (p.name_pt && p.name_pt.toLowerCase().includes(searchTerm));
    return (!searchTerm || nameMatch) &&
           (!selectedBrand || p.brand === selectedBrand) &&
           (!selectedLine || p.line === selectedLine) &&
           (!selectedCategory || p.category === selectedCategory);
  }).forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image || 'default.png'}" alt="${p.name_pt || ''}">
      <h3>${p.name_pt || ''}</h3>
      <p style="color:#888;font-size:14px;">${p.name || ''}</p>
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

<img src="${product.image || 'default.png'}" alt="${product.name_pt || ''}" style="width: 100%; max-height: 500px; object-fit: contain; margin-bottom: 20px; border-radius: 12px;">
    <h2 style="color: #d35400;">${product.name_pt || ''}</h2>
    <p style="color: #7f4f24;"><strong>الاسم:</strong> ${product.name || ''}</p>
    <p style="color: #7f4f24;"><strong>الفئة:</strong> ${product.category}</p>
    <p style="color: #7f4f24;"><strong>الوصف:</strong> ${product.description}</p>
    <p style="color: #7f4f24;"><strong>طريقة الاستخدام:</strong> ${product.usage}</p>
    <p style="color: #7f4f24;"><strong>الشرح:</strong> ${product.explanation}</p>
  `;
  modal.style.display = 'flex';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', renderProducts);
brandFilter.addEventListener('change', renderProducts);
lineFilter.addEventListener('change', renderProducts);
categoryFilter.addEventListener('change', renderProducts);

populateFilters();
renderProducts();
