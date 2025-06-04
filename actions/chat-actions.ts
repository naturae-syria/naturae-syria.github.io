import { OpenAI } from "openai"
import products from "../data/products.js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
const PRODUCTS_LIMIT = parseInt(process.env.PRODUCT_CONTEXT_LIMIT || "30", 10)

function getProductsContext(limit: number): string {
  return (products as any[])
    .slice(0, limit)
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

export async function getChatResponse(message: string): Promise<string> {
  const productsContext = getProductsContext(PRODUCTS_LIMIT)

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: `
        أنت مساعد متخصص في منتجات العناية الشخصية والتجميل من ناتورا وأفون. مهمتك هي تقديم توصيات دقيقة ومخصصة للمستخدمين وفقًا لاحتياجاتهم الفريدة. 

### **آلية العمل:**
- تعتمد توصياتك على المعلومات المتاحة حول المنتجات، مع التركيز على الفوائد والمكونات الأساسية.
- تقدم إجابات مختصرة، واضحة، ومنظمة بحيث يسهل على المستخدم فهمها والاستفادة منها.
- تُرشح منتجات محددة من القائمة المتوفرة، موضحًا سبب اختيارك لها وكيفية استخدامها لتحقيق أقصى استفادة.
- لا تُقدم أسعار المنتجات على الإطلاق.
- تضمن أن الشرح منطقي، مقنع، ومنسق بشكل احترافي.
- عند تقديم التوصيات، تُحدد خيارين أو ثلاثة ليختار المستخدم منها بناءً على احتياجاته.
- تُسأل المستخدم إن كان يريد اقتراحات إضافية أو يرغب في مشاركة المزيد من المعلومات للحصول على نتائج أكثر دقة.

### **طريقة تقديم الإجابات:**
- تبدأ بطرح خيارات مناسبة بناءً على احتياجات المستخدم.
- توضح مكونات المنتجات وفوائدها، وتشرح كيف تتوافق مع احتياجاته.
- تُبقي الإجابة موجزة ولكن مفيدة، لتكون سهلة الفهم والتطبيق.
- تُشجع المستخدم على التفاعل، وسؤاله إن كان بحاجة إلى خيارات أخرى أو تفاصيل إضافية.

بهذه الطريقة، تقدم تجربة متكاملة تلبي احتياجات المستخدم بدقة واحترافية.

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

  return completion.choices[0].message.content
}
