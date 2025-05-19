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

    // تحويل الروابط إلى روابط قابلة للنقر
    const linkedMessage = message.replace(
      /\b(زيت الأرغان|سيروم|كريم|شامبو|بلسم|ماسك|مرطب|بخاخ|غسول|مقشر|جل)\s+([^.،,]+)/g,
      "<strong>$1 $2</strong>",
    )

    messageElement.innerHTML = linkedMessage
    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // وظيفة لحساب درجة التطابق بين نص الاستعلام والمنتج
  function calculateMatchScore(query, product) {
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
    if (queryWords.length === 0) return 0

    let score = 0

    // البحث في اسم المنتج
    if (product.name) {
      const productName = product.name.toLowerCase()
      queryWords.forEach((word) => {
        if (productName.includes(word)) {
          score += 3 // وزن أعلى لتطابق الاسم
        }
      })
    }

    // البحث في الاسم البرتغالي
    if (product.name_pt) {
      const productNamePt = product.name_pt.toLowerCase()
      queryWords.forEach((word) => {
        if (productNamePt.includes(word)) {
          score += 1
        }
      })
    }

    // البحث في الوصف
    if (product.description) {
      const description = product.description.toLowerCase()
      queryWords.forEach((word) => {
        if (description.includes(word)) {
          score += 2
        }
      })
    }

    // البحث في الفئة
    if (product.category) {
      const category = product.category.toLowerCase()
      queryWords.forEach((word) => {
        if (category.includes(word)) {
          score += 4 // وزن أعلى للفئة
        }
      })
    }

    // البحث في العلامة التجارية
    if (product.brand) {
      const brand = product.brand.toLowerCase()
      queryWords.forEach((word) => {
        if (brand.includes(word)) {
          score += 2
        }
      })
    }

    // البحث في الخط
    if (product.line) {
      const line = product.line.toLowerCase()
      queryWords.forEach((word) => {
        if (line.includes(word)) {
          score += 2
        }
      })
    }

    // البحث في طريقة الاستخدام
    if (product.usage) {
      const usage = product.usage.toLowerCase()
      queryWords.forEach((word) => {
        if (usage.includes(word)) {
          score += 1
        }
      })
    }

    // البحث في الشرح
    if (product.explanation) {
      const explanation = product.explanation.toLowerCase()
      queryWords.forEach((word) => {
        if (explanation.includes(word)) {
          score += 1
        }
      })
    }

    return score
  }

  // وظيفة للبحث عن منتجات مطابقة للاستعلام
  function findMatchingProducts(query, limit = 3) {
    if (!query || query.trim().length < 3) return []

    // حساب درجة التطابق لكل منتج
    const scoredProducts = products.map((product) => ({
      product,
      score: calculateMatchScore(query, product),
    }))

    // ترتيب المنتجات حسب درجة التطابق
    const sortedProducts = scoredProducts.filter((item) => item.score > 0).sort((a, b) => b.score - a.score)

    // إرجاع المنتجات الأكثر تطابقًا
    return sortedProducts.slice(0, limit).map((item) => item.product)
  }

  // وظيفة لتحليل استعلام المستخدم وتحديد نوع الاستعلام
  function analyzeQuery(query) {
    const lowerQuery = query.toLowerCase()

    // تحديد الفئات الرئيسية
    const categories = {
      hair: ["شعر", "الشعر", "شامبو", "بلسم", "ماسك", "سيروم", "زيت"],
      skin: ["بشرة", "البشرة", "وجه", "الوجه", "كريم", "مرطب", "تفتيح", "تجاعيد"],
      hands: ["يد", "اليدين", "يدين"],
      feet: ["قدم", "القدمين", "قدمين"],
      body: ["جسم", "الجسم", "مرطب جسم", "زيت جسم"],
      fragrance: ["عطر", "رائحة", "عطور"],
      price: ["سعر", "تكلفة", "ثمن", "غالي", "رخيص"],
      delivery: ["توصيل", "شحن", "استلام"],
      brands: ["ناتورا", "أفون", "natura", "avon"],
    }

    // تحديد الخصائص
    const attributes = {
      dry: ["جاف", "جافة", "ترطيب", "تشقق"],
      oily: ["دهني", "دهنية", "زيتي", "لمعان"],
      damaged: ["تالف", "متقصف", "مقصف", "تكسر", "تقصف"],
      curly: ["مجعد", "كيرلي", "تجعيد", "تموج"],
      aging: ["تجاعيد", "شيخوخة", "علامات تقدم", "خطوط"],
      sensitive: ["حساس", "حساسة", "تهيج", "احمرار"],
    }

    // تحديد نوع الاستعلام
    let queryType = null
    for (const [type, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        queryType = type
        break
      }
    }

    // تحديد الخصائص
    const queryAttributes = []
    for (const [attr, keywords] of Object.entries(attributes)) {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        queryAttributes.push(attr)
      }
    }

    return {
      type: queryType,
      attributes: queryAttributes,
      originalQuery: query,
    }
  }

  // وظيفة لإنشاء رد ديناميكي بناءً على تحليل الاستعلام
  function generateDynamicResponse(queryAnalysis) {
    const { type, attributes, originalQuery } = queryAnalysis

    // البحث عن منتجات مطابقة
    const matchingProducts = findMatchingProducts(originalQuery, 3)

    // إذا لم يتم العثور على منتجات مطابقة
    if (matchingProducts.length === 0) {
      return "لم أتمكن من العثور على منتجات تطابق استفسارك. يمكنك تجربة استخدام كلمات أخرى أو اختيار إحدى الفئات من الأزرار أدناه."
    }

    // إنشاء مقدمة الرد بناءً على نوع الاستعلام والخصائص
    let responseIntro = ""

    if (type === "hair") {
      if (attributes.includes("dry") || attributes.includes("damaged")) {
        responseIntro = "للعناية بالشعر الجاف والمتقصف، أنصحك بهذه المنتجات:\n\n"
      } else if (attributes.includes("curly")) {
        responseIntro = "للعناية بالشعر المجعد والكيرلي، أنصحك بهذه المنتجات:\n\n"
      } else if (attributes.includes("oily")) {
        responseIntro = "للعناية بالشعر الدهني، أنصحك بهذه المنتجات:\n\n"
      } else {
        responseIntro = "للعناية بالشعر، أنصحك بهذه المنتجات:\n\n"
      }
    } else if (type === "skin") {
      if (attributes.includes("dry")) {
        responseIntro = "للبشرة الجافة، أنصحك بهذه المنتجات:\n\n"
      } else if (attributes.includes("oily")) {
        responseIntro = "للبشرة الدهنية، أنصحك بهذه المنتجات:\n\n"
      } else if (attributes.includes("aging")) {
        responseIntro = "لمكافحة التجاعيد وعلامات التقدم في السن، أنصحك بهذه المنتجات:\n\n"
      } else if (attributes.includes("sensitive")) {
        responseIntro = "للبشرة الحساسة، أنصحك بهذه المنتجات:\n\n"
      } else {
        responseIntro = "للعناية بالبشرة، أنصحك بهذه المنتجات:\n\n"
      }
    } else if (type === "hands") {
      responseIntro = "للعناية باليدين، أنصحك بهذه المنتجات:\n\n"
    } else if (type === "feet") {
      responseIntro = "للعناية بالقدمين، أنصحك بهذه المنتجات:\n\n"
    } else if (type === "body") {
      responseIntro = "للعناية بالجسم، أنصحك بهذه المنتجات:\n\n"
    } else if (type === "fragrance") {
      responseIntro = "للعطور والروائح، أنصحك بهذه المنتجات:\n\n"
    } else if (type === "price") {
      return (
        "أسعار منتجاتنا متنوعة لتناسب جميع الميزانيات:\n\n" +
        "- منتجات العناية الشخصية الأساسية: من 4$ إلى 20$\n" +
        "- منتجات العناية بالشعر المتخصصة: من 20$ إلى 60$\n" +
        "- منتجات العناية بالبشرة المتقدمة: من 50$ إلى 140$\n\n" +
        "يمكنك تصفح المنتجات في الموقع لمعرفة السعر المحدد لكل منتج."
      )
    } else if (type === "delivery") {
      return (
        "نوفر خدمة التوصيل لجميع المناطق في سوريا:\n\n" +
        "- التوصيل داخل دمشق: خلال 1-2 يوم عمل\n" +
        "- التوصيل للمحافظات الأخرى: خلال 3-5 أيام عمل\n\n" +
        "للطلب والاستفسار عن التوصيل، يرجى التواصل معنا عبر واتساب على الرقم الموجود أسفل الصفحة."
      )
    } else if (type === "brands") {
      if (originalQuery.includes("ناتورا") || originalQuery.toLowerCase().includes("natura")) {
        return (
          "ناتورا هي شركة برازيلية رائدة في مجال مستحضرات التجميل والعناية الشخصية. تعتمد في فلسفتها على مبدأ الاستدامة، حيث يتم اختيار مكوناتها الطبيعية من مصادر مسؤولة، خاصة من غابات الأمازون الغنية.\n\n" +
          "من أشهر مجموعاتها:\n" +
          "- تودوديا (Tododia): للعناية اليومية بالجسم\n" +
          "- كرونوس (Chronos): لمكافحة علامات التقدم في العمر\n" +
          "- إيكوس (Ekos): تجسد التزام ناتورا بالاستدامة\n" +
          "- لومينا (Lumina): تركيبات متطورة للعناية بالشعر"
        )
      } else if (originalQuery.includes("أفون") || originalQuery.toLowerCase().includes("avon")) {
        return (
          "أفون هي شركة عالمية معروفة بتاريخها العريق في توفير منتجات تجميل وعناية شخصية عالية الجودة بأسعار مناسبة، مع تركيزها على تمكين المرأة.\n\n" +
          "من أشهر مجموعاتها:\n" +
          "- أفون كير (Avon Care): مستحضرات أساسية للعناية اليومية\n" +
          "- زيوت أفون (Avon Óleo): زيوت طبيعية للعناية العميقة\n" +
          "- رينيو (Renew): متخصصة في مكافحة علامات التقدم في السن"
        )
      }
    } else {
      responseIntro = "وجدت بعض المنتجات التي قد تهمك:\n\n"
    }

    // إضافة المنتجات المطابقة إلى الرد
    let productsInfo = ""
    matchingProducts.forEach((product, index) => {
      const price = product.price ? convertToUSD(transformPrice(product.price).toFixed(2)) : "غير متوفر"
      productsInfo += `${index + 1}. <strong>${product.name || product.name_pt}</strong>: ${product.description || ""}${price ? ` - السعر: $${price}` : ""}\n\n`
    })

    return responseIntro + productsInfo
  }

  async function sendChatMessage(message) {
    if (!message.trim()) return

    // إضافة رسالة المستخدم
    addChatMessage(message, "user")

    // إظهار مؤشر الكتابة
    const typingIndicator = document.createElement("div")
    typingIndicator.className = "typing-indicator"
    typingIndicator.textContent = "جاري الكتابة..."
    typingIndicator.style.color = "#888"
    typingIndicator.style.fontStyle = "italic"
    typingIndicator.style.margin = "10px 0"
    chatMessages.appendChild(typingIndicator)

    // محاكاة تأخير الرد (1 ثانية)
    setTimeout(() => {
      // إزالة مؤشر الكتابة
      chatMessages.removeChild(typingIndicator)

      // تحليل استعلام المستخدم
      const queryAnalysis = analyzeQuery(message)

      // إنشاء رد ديناميكي
      const botResponse = generateDynamicResponse(queryAnalysis)

      // إضافة رد الروبوت
      addChatMessage(botResponse, "bot")
    }, 1000)
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
