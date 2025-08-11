
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
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))
      btn.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  const companyTabBtns = document.querySelectorAll(".company-tab-btn")
  const companyTabContents = document.querySelectorAll(".company-tab-content")

  companyTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const companyId = btn.dataset.company
      companyTabBtns.forEach((b) => b.classList.remove("active"))
      companyTabContents.forEach((c) => c.classList.remove("active"))
      btn.classList.add("active")
      document.getElementById(`${companyId}-content`).classList.add("active")
    })
  })

  // هنا نتأكد أن المنتجات معرفة مسبقاً من ملف products.js
  if (typeof products === "undefined") {
    console.error("البيانات غير متوفرة: تأكد من أن ملف products.js يتم تحميله قبل هذا الملف.")
    return
  }

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

  function transformPrice(priceBRL) {
    if (!priceBRL || isNaN(priceBRL)) {
      return 0;
    }
    const base = Number.parseFloat(priceBRL);

    let result;
    if (base >= 106) {
      result = (base * 1.5) + 18;
    } else if (base >= 60) {
      result = (base * 1.6) + 18;
    } else if (base < 6) {
      result = (base * 4.3) + 18;
    } else if (base < 16) {
      result = (base * 3.17) + 18;
    } else if (base < 20) {
      result = (base * 4) + 18;
    } else if (base < 33) {
      result = (base *2.9) + 18;
    } else if (base < 41) {
      result = (base *2.62) + 18;  
    } else if (base <= 50) {
      result = (base * 3.2) + 18;
    } else {
      // 50 < base < 60
      result = (base * 2.2) + 18;
    }

    // تقريب لرقمين عشريّين:
    return Math.round(result * 100) / 100;
  }
  

  function convertToUSD(brlAmount) {
    if (!brlAmount || isNaN(brlAmount)) return ""
    const usdRate = 1 / 6
    const value = Number.parseFloat(brlAmount) * usdRate
    return (Math.ceil(value * 10) / 10).toFixed(1)
  }

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

    productsCount.textContent = `تم العثور على ${filteredProducts.length} منتج`

    if (filteredProducts.length === 0) {
      productsGrid.classList.add("hidden")
      noProducts.classList.remove("hidden")
    } else {
      productsGrid.classList.remove("hidden")
      noProducts.classList.add("hidden")
      productsGrid.innerHTML = ""
      filteredProducts.forEach((product) => {
        const adjustedBRL = transformPrice(product.price).toFixed(2)
        const usdPrice = convertToUSD(adjustedBRL)
        const productCard = document.createElement("div")
        productCard.className = "product-card"
        productCard.setAttribute("tabindex", "0")
        productCard.setAttribute("role", "button")
        productCard.setAttribute("aria-label", `عرض تفاصيل ${product.name || product.name_pt || "المنتج"}`)
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name || product.name_pt || "صورة منتج"}" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name_pt || ""}</h3>
            <p class="product-subtitle">${product.name || ""}</p>
            <div class="product-tags" aria-label="فئات المنتج">
              ${product.brand ? `<span class="product-tag tag-brand">${product.brand}</span>` : ""}
              ${product.category ? `<span class="product-tag tag-category">${product.category}</span>` : ""}
              ${product.availability ? `<span class="product-tag tag-availability" style="background-color: ${product.availability === 'متوفر' ? '#28a745' : '#fd7e14'};">${product.availability}</span>` : ""}
            </div>
            ${usdPrice ? `<div class="product-price" aria-label="سعر المنتج: ${usdPrice} دولار">$${usdPrice}</div>` : ""}
          </div>
        `
        productCard.addEventListener("click", () => openProductModal(product))
        productsGrid.appendChild(productCard)
      })
    }
  }

  function openProductModal(product) {
    const adjustedBRL = transformPrice(product.price).toFixed(2)
    const usdPrice = convertToUSD(adjustedBRL)

    // إضافة سمات ARIA للنافذة المنبثقة
    productModal.setAttribute("role", "dialog")
    productModal.setAttribute("aria-modal", "true")
    productModal.setAttribute("aria-labelledby", "modal-title")
    productModal.setAttribute("aria-describedby", "modal-description")

    modalContentContainer.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name || product.name_pt || "صورة منتج"}">
        </div>
        <div class="modal-product-info">
          <h2 id="modal-title">${product.name_pt || ""}</h2>
          <h3 id="modal-description">${product.name || ""}</h3>
          <div class="modal-product-tags">
            ${product.brand ? `<span class="modal-product-tag tag-brand">${product.brand}</span>` : ""}
            ${product.line ? `<span class="modal-product-tag tag-brand">${product.line}</span>` : ""}
            ${product.category ? `<span class="modal-product-tag tag-category">${product.category}</span>` : ""}
            ${product.availability ? `<span class="modal-product-tag tag-availability" style="background-color: ${product.availability === 'متوفر' ? '#28a745' : '#fd7e14'};">${product.availability}</span>` : ""}
          </div>
          ${usdPrice ? `<div class="modal-product-price">$${usdPrice}</div>` : ""}
          <div class="modal-product-details">
            ${product.description ? `<h4>الوصف:</h4><p>${product.description}</p>` : ""}
            ${product.usage ? `<h4>طريقة الاستخدام:</h4><p>${product.usage}</p>` : ""}
            ${product.explanation ? `<h4>الشرح:</h4><p>${product.explanation}</p>` : ""}
            ${product.recommended_for ? `<h4>لمن يُنصح به؟:</h4><p>${product.recommended_for}</p>` : ""}
          </div>
        </div>
      </div>
    `
    productModal.style.display = "block"

    // تركيز لوحة المفاتيح على النافذة المنبثقة
    setTimeout(() => {
      document.querySelector(".close-modal").focus()
    }, 100)
  }

  function closeProductModal() {
    productModal.style.display = "none"
    // إعادة التركيز إلى العنصر الذي فتح النافذة المنبثقة
    if (document.activeElement) {
      document.activeElement.focus()
    }
  }

  function resetFilters() {
    searchInput.value = ""
    brandFilter.value = ""
    lineFilter.value = ""
    categoryFilter.value = ""
    filterAndDisplayProducts()
  }

  searchInput.addEventListener("input", filterAndDisplayProducts)
  brandFilter.addEventListener("change", filterAndDisplayProducts)
  lineFilter.addEventListener("change", filterAndDisplayProducts)
  categoryFilter.addEventListener("change", filterAndDisplayProducts)
  resetFiltersBtn.addEventListener("click", resetFilters)
  resetFiltersBtnAlt.addEventListener("click", resetFilters)
  closeModal.addEventListener("click", closeProductModal)

  window.addEventListener("click", (event) => {
    if (event.target === productModal) {
      closeProductModal()
    }
  })

  // إضافة مستمع لمفتاح Escape لإغلاق النافذة المنبثقة
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && productModal.style.display === "block") {
      closeProductModal()
    }
  })

  filterAndDisplayProducts()

  // -----------------------------
  // Chatbot functionality
  const chatToggle = document.getElementById("chat-toggle")
  const chatBox = document.getElementById("chat-box")
  const chatMessages = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")
  const CHAT_API_URL = window.CHAT_API_URL || "/api/chat"


  function appendMessage(sender, text) {
    const el = document.createElement("div")
    el.className = "chat-message"
    el.innerHTML = `<strong>${sender}:</strong> ${text}`
    chatMessages.appendChild(el)
    chatMessages.scrollTop = chatMessages.scrollHeight
    return el
  }

  chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("hidden")
    const expanded = chatToggle.getAttribute("aria-expanded") === "true"
    chatToggle.setAttribute("aria-expanded", String(!expanded))
  })

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const message = chatInput.value.trim()
    if (!message) return
    appendMessage("أنت", message)
    chatInput.value = ""

    const loading = appendMessage("المساعد", "...")
    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      loading.innerHTML = `<strong>المساعد:</strong> ${data.response}`
    } catch (err) {
      loading.innerHTML = "<strong>المساعد:</strong> حدث خطأ بالاتصال بالخادم"
    }
  })
  // -----------------------------
})
