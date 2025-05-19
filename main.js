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

  // متغيرات الشات بوت
  const chatToggle = document.getElementById("chat-toggle")
  const chatBox = document.getElementById("chat-box")
  const chatMessages = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")
  const quickOptions = document.getElementById("quick-options")

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
    if (!priceBRL || isNaN(priceBRL)) return 0
    const base = Number.parseFloat(priceBRL)
    if (base >= 106) return base * 1.5
    if (base >= 60) return base * 2
    if (base < 20) return base * 4.2
    return base <= 50 ? base * 3.2 : base * 2.5
  }

  function convertToUSD(brlAmount) {
    if (!brlAmount || isNaN(brlAmount)) return ""
    const usdRate = 1 / 5.2
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
          </div>
          ${usdPrice ? `<div class="modal-product-price">$${usdPrice}</div>` : ""}
          <div class="modal-product-details">
            ${product.description ? `<h4>الوصف:</h4><p>${product.description}</p>` : ""}
            ${product.usage ? `<h4>طريقة الاستخدام:</h4><p>${product.usage}</p>` : ""}
            ${product.explanation ? `<h4>الشرح:</h4><p>${product.explanation}</p>` : ""}
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

  // وظائف الشات بوت
  function toggleChat() {
    chatBox.classList.toggle("hidden")
    const isExpanded = chatBox.classList.contains("hidden") ? "false" : "true"
    chatToggle.setAttribute("aria-expanded", isExpanded)

    if (isExpanded === "true") {
      // إضافة رسالة ترحيب إذا كانت الدردشة فارغة
      if (chatMessages.children.length === 0) {
        addChatMessage("مرحباً! أنا مساعدك الافتراضي للعناية بالمنتجات. كيف يمكنني مساعدتك اليوم؟", "bot")
      }
      chatInput.focus()
    }
  }

  function addChatMessage(message, sender) {
    const messageElement = document.createElement("div")
    messageElement.className = `chat-message ${sender}-message`
    messageElement.style.marginBottom = "10px"
    messageElement.style.padding = "8px 12px"
    messageElement.style.borderRadius = "8px"
    messageElement.style.maxWidth = "80%"

    if (sender === "user") {
      messageElement.style.marginLeft = "auto"
      messageElement.style.backgroundColor = "#f97316"
      messageElement.style.color = "white"
    } else {
      messageElement.style.marginRight = "auto"
      messageElement.style.backgroundColor = "#f1f1f1"
      messageElement.style.color = "#333"
    }

    messageElement.innerHTML = message
    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  async function sendChatMessage(message) {
    if (!message.trim()) return

    // إضافة رسالة المستخدم
    addChatMessage(message, "user")

    // إظهار مؤشر الكتابة
    const typingIndicator = document.createElement("div")
    typingIndicator.className = "typing-indicator bot-message"
    typingIndicator.innerHTML = `
      <div class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `
    chatMessages.appendChild(typingIndicator)
    chatMessages.scrollTop = chatMessages.scrollHeight

    try {
      // إرسال الرسالة إلى API
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error("فشل الاتصال بالخادم")
      }

      const data = await response.json()

      // إزالة مؤشر الكتابة
      chatMessages.removeChild(typingIndicator)

      // إضافة رد الروبوت
      if (data.response) {
        // تنسيق الرد لتحسين العرض
        const formattedResponse = formatBotResponse(data.response)
        addChatMessage(formattedResponse, "bot")
      } else {
        addChatMessage("عذراً، لم أتمكن من فهم طلبك. هل يمكنك إعادة صياغته؟", "bot")
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // إزالة مؤشر الكتابة
      if (typingIndicator.parentNode) {
        chatMessages.removeChild(typingIndicator)
      }

      // إضافة رسالة خطأ
      addChatMessage("عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.", "bot")
    }
  }

  // تنسيق رد الروبوت لتحسين العرض
  function formatBotResponse(response) {
    // تحويل أسماء المنتجات إلى نص بارز
    let formattedResponse = response.replace(
      /\b(زيت|سيروم|كريم|شامبو|بلسم|ماسك|مرطب|بخاخ|غسول|مقشر|جل)\s+([^.،,]+)/g,
      "<strong>$1 $2</strong>",
    )

    // تحويل أسماء العلامات التجارية إلى نص بارز
    formattedResponse = formattedResponse.replace(
      /\b(ناتورا|أفون|Natura|Avon|TODODIA|CHRONOS|EKOS|LUMINA|RENEW|FACES)\b/g,
      "<strong>$1</strong>",
    )

    // تحويل الأسعار إلى نص بارز
    formattedResponse = formattedResponse.replace(/\$(\d+(\.\d+)?)/g, "<strong class='price'>$$$1</strong>")

    // تحويل النقاط إلى قائمة منسقة
    formattedResponse = formattedResponse.replace(/(\d+\.\s+)/g, "<br>• ")

    return formattedResponse
  }

  // إضافة الخيارات السريعة
  function setupQuickOptions() {
    const quickOptionsData = [
      { text: "العناية بالشعر", query: "ما هي أفضل منتجات العناية بالشعر؟" },
      { text: "العناية بالبشرة", query: "أريد منتجات للعناية بالبشرة" },
      { text: "شعر جاف", query: "منتجات للشعر الجاف والمتقصف" },
      { text: "بشرة دهنية", query: "منتجات للبشرة الدهنية" },
      { text: "مكافحة التجاعيد", query: "كريم لمكافحة التجاعيد" },
      { text: "الأسعار", query: "ما هي أسعار المنتجات؟" },
      { text: "التوصيل", query: "كيف يتم التوصيل؟" },
    ]

    quickOptions.innerHTML = ""
    quickOptionsData.forEach((option) => {
      const button = document.createElement("button")
      button.className = "quick-option-btn"
      button.textContent = option.text
      button.addEventListener("click", () => {
        chatInput.value = option.query
        sendChatMessage(option.query)
      })
      quickOptions.appendChild(button)
    })
  }

  // إضافة مستمعي الأحداث
  searchInput.addEventListener("input", filterAndDisplayProducts)
  brandFilter.addEventListener("change", filterAndDisplayProducts)
  lineFilter.addEventListener("change", filterAndDisplayProducts)
  categoryFilter.addEventListener("change", filterAndDisplayProducts)
  resetFiltersBtn.addEventListener("click", resetFilters)
  resetFiltersBtnAlt.addEventListener("click", resetFilters)
  closeModal.addEventListener("click", closeProductModal)

  // مستمعي أحداث الشات بوت
  chatToggle.addEventListener("click", toggleChat)
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const message = chatInput.value
    chatInput.value = ""
    sendChatMessage(message)
  })

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

  // تهيئة الخيارات السريعة
  setupQuickOptions()

  filterAndDisplayProducts()
})
