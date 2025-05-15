
document.addEventListener("DOMContentLoaded", () => {
  // تحديث السنة الحالية في التذييل
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // تهيئة العناصر
  const searchInput = document.getElementById("search-input");
  const brandFilter = document.getElementById("brand-filter");
  const lineFilter = document.getElementById("line-filter");
  const categoryFilter = document.getElementById("category-filter");
  const resetFiltersBtn = document.getElementById("reset-filters");
  const resetFiltersBtnAlt = document.getElementById("reset-filters-btn");
  const productsGrid = document.getElementById("products-grid");
  const productsCount = document.getElementById("products-count");
  const noProducts = document.getElementById("no-products");
  const productModal = document.getElementById("product-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalContentContainer = document.getElementById("modal-content-container");

  // دالة لإنشاء بطاقة منتج
  function createProductCard(product) {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3 class="product-name">${product.name}</h3>
        <p class="product-brand">${product.brand} - ${product.line}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price} ر.س</p>
      </div>
    `;
  }

  // دالة لعرض المنتجات
  function displayProducts(productsList) {
    productsGrid.innerHTML = ""; // مسح المحتوى الحالي
    if (productsList.length === 0) {
      noProducts.style.display = "block";
      productsCount.textContent = "0 منتج";
      return;
    }
    noProducts.style.display = "none";
    productsList.forEach(product => {
      productsGrid.innerHTML += createProductCard(product);
    });
    productsCount.textContent = `${productsList.length} منتج`;
  }

  // التحقق من وجود المتغير products من products.js
  if (typeof products !== "undefined" && Array.isArray(products)) {
    displayProducts(products);
  } else {
    console.error("لم يتم العثور على بيانات المنتجات. تأكد من تحميل ملف products.js قبل main.js");
  }
});
