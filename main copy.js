document.addEventListener("DOMContentLoaded", () => {
  // تحديث السنة الحالية في التذييل
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // تهيئة المتغيرات
  const searchInput = document.getElementById("search-input")
  const brandFilter = document.getElementById("brand-filter")
  const lineFilter = document.getElementById("line-filter")
  const categoryFilter = document.getElementById("category-filter")
  const resetFiltersBtn = document.getElementById("reset-filters")
  const resetFiltersBtnAlt = document.getElementById("reset-filters-btn")
  const productsGrid = document.getElementById("products-grid")
  const productsCount = document.getElementById("products-count")
  const noProducts = document.getElementById("no-products")
  const productModal = document.getElementById("product-modal")
  const closeModal = document.querySelector(".close-modal")
  const modalContentContainer = document.getElementById("modal-content-container")

  // تهيئة التبويبات
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab

      // إزالة الفئة النشطة من جميع الأزرار والمحتويات
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // إضافة الفئة النشطة إلى الزر والمحتوى المحدد
      btn.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // تهيئة تبويبات الشركة
  const companyTabBtns = document.querySelectorAll(".company-tab-btn")
  const companyTabContents = document.querySelectorAll(".company-tab-content")

  companyTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const companyId = btn.dataset.company

      // إزالة الفئة النشطة من جميع الأزرار والمحتويات
      companyTabBtns.forEach((b) => b.classList.remove("active"))
      companyTabContents.forEach((c) => c.classList.remove("active"))

      // إضافة الفئة النشطة إلى الزر والمحتوى المحدد
      btn.classList.add("active")
      document.getElementById(`${companyId}-content`).classList.add("active")
    })
  })

  // بيانات المنتجات (مثال)
  const products = [
    {
      id: 1,
      name: "Product 1",
      name_pt: "Produto 1",
      brand: "Brand A",
      line: "Line X",
      category: "Category 1",
      image: "https://via.placeholder.com/150",
      price: 25,
      description: "Description of Product 1",
      usage: "How to use Product 1",
      explanation: "Explanation of Product 1",
    },
    {
      id: 2,
      name: "Product 2",
      name_pt: "Produto 2",
      brand: "Brand B",
      line: "Line Y",
      category: "Category 2",
      image: "https://via.placeholder.com/150",
      price: 75,
      description: "Description of Product 2",
      usage: "How to use Product 2",
      explanation: "Explanation of Product 2",
    },
    {
      id: 3,
      name: "Product 3",
      name_pt: "Produto 3",
      brand: "Brand A",
      line: "Line X",
      category: "Category 3",
      image: "https://via.placeholder.com/150",
      price: 120,
      description: "Description of Product 3",
      usage: "How to use Product 3",
      explanation: "Explanation of Product 3",
    },
  ]

  // ملء قوائم الفلترة
  const uniqueBrands = [...new Set(products.map((item) => item.brand).filter(Boolean))]
  const uniqueLines = [...new Set(products.map((item) => item.line).filter(Boolean))]
  const uniqueCategories = [...new Set(products.map((item) => item.category).filter(Boolean))]

  uniqueBrands.forEach((brand) => {
    const option = document.createElement("option")
    option.value = brand
    option.textContent = brand
    brandFilter.appendChild(option)
  })

  uniqueLines.forEach((line) => {
    const option = document.createElement("option")
    option.value = line
    option.textContent = line
    lineFilter.appendChild(option)
  })

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category
    option.textContent = category
    categoryFilter.appendChild(option)
  })

  // تحويل سعر البرازيلي إلى الدولار
  function transformPrice(priceBRL) {
    if (!priceBRL || isNaN(priceBRL)) return 0
    const base = Number.parseFloat(priceBRL)
    if (base >= 106) return base * 1.5
    if (base >= 60) return base * 2
    if (base < 20) return base * 4.2
    return base <= 50 ? base * 3.2 : base * 2.5
  }

  function convertToUSD(brlAmount) {
    if (!brlAmount || isNaN(brlAmount)) return ""
    const usdRate = 1 / 5.2 // معدل تحويل ثابت
    const value = Number.parseFloat(brlAmount) * usdRate
    return (Math.ceil(value * 10) / 10).toFixed(1)
  }

  // تصفية المنتجات وعرضها
  function filterAndDisplayProducts() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedBrand = brandFilter.value
    const selectedLine = lineFilter.value
    const selectedCategory = categoryFilter.value

    const filteredProducts = products.filter((product) => {
      const nameMatch =
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.name_pt && product.name_pt.toLowerCase().includes(searchTerm))

      return (
        (!searchTerm || nameMatch) &&
        (!selectedBrand || selectedBrand === "all" || product.brand === selectedBrand) &&
        (!selectedLine || selectedLine === "all" || product.line === selectedLine) &&
        (!selectedCategory || selectedCategory === "all" || product.category === selectedCategory)
      )
    })

    // تحديث عدد المنتجات
    productsCount.textContent = `تم العثور على ${filteredProducts.length} منتج`

    // عرض أو إخفاء رسالة "لا توجد منتجات"
    if (filteredProducts.length === 0) {
      productsGrid.classList.add("hidden")
      noProducts.classList.remove("hidden")
    } else {
      productsGrid.classList.remove("hidden")
      noProducts.classList.add("hidden")

      // عرض المنتجات
      productsGrid.innerHTML = ""

      filteredProducts.forEach((product) => {
        const adjustedBRL = transformPrice(product.price).toFixed(2)
        const usdPrice = convertToUSD(adjustedBRL)

        const productCard = document.createElement("div")
        productCard.className = "product-card"
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name || product.name_pt || "Product image"}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name_pt || ""}</h3>
            <p class="product-subtitle">${product.name || ""}</p>
            <div class="product-tags">
              ${product.brand ? `<span class="product-tag tag-brand">${product.brand}</span>` : ""}
              ${product.category ? `<span class="product-tag tag-category">${product.category}</span>` : ""}
            </div>
            ${usdPrice ? `<div class="product-price">$${usdPrice}</div>` : ""}
          </div>
        `

        productCard.addEventListener("click", () => openProductModal(product))

        productsGrid.appendChild(productCard)
      })
    }
  }

  // فتح نافذة تفاصيل المنتج
  function openProductModal(product) {
    const adjustedBRL = transformPrice(product.price).toFixed(2)
    const usdPrice = convertToUSD(adjustedBRL)

    modalContentContainer.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name || product.name_pt || "Product image"}">
        </div>
        <div class="modal-product-info">
          <h2>${product.name_pt || ""}</h2>
          <h3>${product.name || ""}</h3>
          
          <div class="modal-product-tags">
            ${product.brand ? `<span class="modal-product-tag tag-brand">${product.brand}</span>` : ""}
            ${product.line ? `<span class="modal-product-tag tag-brand">${product.line}</span>` : ""}
            ${product.category ? `<span class="modal-product-tag tag-category">${product.category}</span>` : ""}
          </div>
          
          ${usdPrice ? `<div class="modal-product-price">$${usdPrice}</div>` : ""}
          
          <div class="modal-product-details">
            ${
              product.description
                ? `
              <h4>الوصف:</h4>
              <p>${product.description}</p>
            `
                : ""
            }
            
            ${
              product.usage
                ? `
              <h4>طريقة الاستخدام:</h4>
              <p>${product.usage}</p>
            `
                : ""
            }
            
            ${
              product.explanation
                ? `
              <h4>الشرح:</h4>
              <p>${product.explanation}</p>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `

    productModal.style.display = "block"
  }

  // إغلاق نافذة تفاصيل المنتج
  function closeProductModal() {
    productModal.style.display = "none"
  }

  // إعادة ضبط الفلاتر
  function resetFilters() {
    searchInput.value = ""
    brandFilter.value = ""
    lineFilter.value = ""
    categoryFilter.value = ""
    filterAndDisplayProducts()
  }

  // إضافة مستمعي الأحداث
  searchInput.addEventListener("input", filterAndDisplayProducts)
  brandFilter.addEventListener("change", filterAndDisplayProducts)
  lineFilter.addEventListener("change", filterAndDisplayProducts)
  categoryFilter.addEventListener("change", filterAndDisplayProducts)
  resetFiltersBtn.addEventListener("click", resetFilters)
  resetFiltersBtnAlt.addEventListener("click", resetFilters)
  closeModal.addEventListener("click", closeProductModal)

  // إغلاق النافذة المنبثقة عند النقر خارجها
  window.addEventListener("click", (event) => {
    if (event.target === productModal) {
      closeProductModal()
    }
  })

  // عرض المنتجات عند تحميل الصفحة
  filterAndDisplayProducts()
})
