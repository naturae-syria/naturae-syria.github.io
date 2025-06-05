const { OpenAI } = require("openai")
const productsData = require("../data/products.js")

async function loadProducts() {
  return productsData.default || productsData
}

// تهيئة OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// تحويل بيانات المنتجات إلى نص للسياق
async function getProductsContext() {
  const products = await loadProducts()
  return products
    .map((product) => {
      return `
اسم المنتج: ${product.name}
العلامة التجارية: ${product.brand}
الخط: ${product.line}
الفئة: ${product.category}
الوصف: ${product.description || "غير متوفر"}
طريقة الاستخدام: ${product.usage || "غير متوفر"}
الشرح: ${product.explanation || "غير متوفر"}
السعر: $${product.price ? (Math.ceil(product.price * (1 / 5.2) * 10) / 10).toFixed(1) : "غير متوفر"}
    `
    })
    .join("\n---\n")
}

exports.handler = async (event, context) => {
  // التأكد من أن الطلب هو POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    }
  }

  try {
    // استخراج الرسالة من الطلب
    const { message } = JSON.parse(event.body)

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "الرسالة مطلوبة" }),
      }
    }

    // الحصول على سياق المنتجات
    const productsContext = await getProductsContext()

    // إنشاء رسالة للـ AI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `أنت مساعد متخصص في منتجات العناية الشخصية والتجميل من ناتورا وأفون. 
          مهمتك هي تقديم توصيات مناسبة للمستخدمين بناءً على احتياجاتهم.
          استخدم المعلومات التالية عن المنتجات لتقديم إجابات دقيقة ومفيدة.
          قدم إجابات مختصرة ومباشرة وسهلة الفهم.
          اقترح منتجات محددة من القائمة أدناه، واشرح سبب اختيارك لها وكيفية استخدامها.
          لا تقترح منتجات غير موجودة في القائمة.
          
          معلومات المنتجات:
          ${productsContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    // إرجاع الرد
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // للسماح بالوصول من أي مصدر
      },
      body: JSON.stringify({ response: response.choices[0].message.content }),
    }
  } catch (error) {
    console.error("Error in chat completion:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ أثناء معالجة طلبك" }),
    }
  }
}
