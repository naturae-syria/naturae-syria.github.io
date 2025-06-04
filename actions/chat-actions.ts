"use server"

import OpenAI from "openai"
import { products } from "../data/products"

// تهيئة OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// تحويل بيانات المنتجات إلى نص للسياق
function getProductsContext() {
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

export async function getChatResponse(userMessage: string) {
  try {
    // الحصول على سياق المنتجات
    const productsContext = getProductsContext()

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
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error in chat completion:", error)
    return "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."
  }
}
