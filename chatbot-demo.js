// هذا الملف للعرض التوضيحي فقط - يمكن استخدامه بدلاً من الاتصال بـ OpenAI API

document.addEventListener("DOMContentLoaded", () => {
  // تهيئة متغيرات الشات بوت
  const chatToggle = document.getElementById("chat-toggle")
  const chatBox = document.getElementById("chat-box")
  const chatMessages = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")

  // قاعدة بيانات بسيطة للردود
  const responses = {
    "شعري مقصف": `
      بناءً على مشكلة الشعر المقصف، أنصحك بالمنتجات التالية:
      
      1. <strong>زيت الأرغان وجوز الهند للعلاج من أدفانسد تكنيك</strong>: يحتوي على زيوت طبيعية تغذي الشعر وتعالج التقصف. استخدميه على أطراف الشعر الرطب أو الجاف.
      
      2. <strong>سيروم الأرغان والكاميليا</strong>: يساعد على ترطيب الشعر بعمق ويمنع تقصف الأطراف. ضعيه على شعر رطب أو جاف بعد الاستحمام.
      
      3. <strong>ماسك مغذي للشعر من تودوديا</strong>: تركيبة غنية بالزيوت النباتية لترميم الشعر التالف. استخدميه مرة أسبوعياً بعد الغسل واتركيه 3-5 دقائق.
    `,
    "بشرتي جافة": `
      للبشرة الجافة، أوصي بالمنتجات التالية:
      
      1. <strong>كريم الوجه النهاري أفون كير بالفيتامينات المتعددة</strong>: غني بالفيتامينات A، C، و E، يمنح البشرة ترطيباً عميقاً. استخدميه صباحاً.
      
      2. <strong>كريم الوجه الليلي أفون كير</strong>: يحتوي على مغذيات تعمل أثناء النوم لتجديد البشرة. ضعيه ليلاً بعد التنظيف.
      
      3. <strong>مرطب الجسم تودوديا بجوز البقان</strong>: تركيبة مغذية توفر ترطيباً عميقاً للبشرة. استخدميه بعد الاستحمام.
    `,
    "شعري مجعد": `
      للعناية بالشعر المجعد، أنصحك بهذه المنتجات:
      
      1. <strong>جل بلسم تودوديا لتجاعيد الشعر والكيرلي</strong>: مصمم خصيصاً للشعر المجعد، يساعد على تعريف التموجات ومنحها مرونة. استخدميه على شعر رطب.
      
      2. <strong>كريم تمشيط ليمينا للشعر المجعد</strong>: غني بزيت المكاديميا وجوز الهند، يرطب ويفك التشابك. ضعيه على شعر رطب بعد الاستحمام.
      
      3. <strong>زيت ليمينا لتجعيدات الشعر</strong>: يساعد في ترطيب وتعريف تجاعيد الشعر. وزعيه على أطراف الشعر الرطب أو الجاف.
    `,
    "بشرتي دهنية": `
      للبشرة الدهنية، هذه المنتجات مناسبة:
      
      1. <strong>كريم تفتيح الوجه فايسز</strong>: يحتوي على مكونات تساعد في التحكم بإفراز الدهون. استخدميه صباحاً.
      
      2. <strong>صابون سائل مقشر تودوديا برائحة الليمون والنعناع</strong>: ينظف البشرة ويزيل الزيوت الزائدة. استخدميه مرتين أسبوعياً.
    `,
    "تجاعيد البشرة": `
      لمكافحة التجاعيد، أوصي بهذه المنتجات:
      
      1. <strong>كريم النهار رينيو ألتيميت</strong>: تركيبة متقدمة لمحاربة التجاعيد مع حماية من الشمس. استخدميه صباحاً.
      
      2. <strong>كريم الليل رينيو ألتيميت</strong>: يعمل على تجديد البشرة أثناء النوم. ضعيه ليلاً قبل النوم.
      
      3. <strong>كريم معالجة وترطيب محيط العين من كرونوس</strong>: يقلل من الهالات السوداء والانتفاخات حول العين. استخدميه صباحاً ومساءً.
    `,
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

  function sendChatMessage(message) {
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

    // محاكاة تأخير الرد
    setTimeout(() => {
      // إزالة مؤشر الكتابة
      chatMessages.removeChild(typingIndicator)

      // البحث عن رد مناسب
      let response =
        "عذراً، لا يمكنني فهم استفسارك. هل يمكنك إعادة صياغته؟ يمكنك سؤالي عن مشاكل الشعر المقصف، البشرة الجافة، الشعر المجعد، البشرة الدهنية، أو تجاعيد البشرة."

      // البحث في قاعدة البيانات البسيطة
      for (const [key, value] of Object.entries(responses)) {
        if (message.includes(key)) {
          response = value
          break
        }
      }

      // إضافة رد الروبوت
      addChatMessage(response, "bot")
    }, 1000)
  }

  // إضافة مستمعي أحداث الشات بوت
  chatToggle.addEventListener("click", toggleChat)
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const message = chatInput.value
    chatInput.value = ""
    sendChatMessage(message)
  })
})
