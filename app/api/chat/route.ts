import { type NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/actions/chat-actions";

// عرف كل الأصول (origins) المسموح بها هنا
// هذا Array بيسمح لك تحدد نطاقات ثابتة ونطاقات فرعية
const ALLOWED_ORIGINS = [
  "https://naturae-syria.github.io", // السماح بهذا النطاق المحدد
  ".acrisign.com", // السماح بأي نطاق فرعي ينتهي بـ ".acrisign.com"
  ".acrisign.com.br" // السماح بأي نطاق فرعي ينتهي بـ ".acrisign.com.br"
];

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const origin = request.headers.get('origin'); // الحصول على الأصل (Origin) من رأس الطلب

    // التحقق إذا كان الأصل القادم من الطلب مسموحاً به بناءً على ALLOWED_ORIGINS
    let isOriginAllowed = false;
    if (origin) {
      isOriginAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
        // إذا كان الأصل يطابق تماماً أحد القيم في القائمة
        if (allowedOrigin === origin) {
          return true;
        }
        // إذا كان الأصل ينتهي بأحد القيم اللي بتبدأ بنقطة (للنطاقات الفرعية)
        if (allowedOrigin.startsWith('.') && origin.endsWith(allowedOrigin)) {
          return true;
        }
        return false;
      });
    }

    // إذا كان الأصل غير مسموح به، ارجع خطأ 403 Forbidden
    if (!isOriginAllowed) {
        return NextResponse.json({ error: "غير مصرح بالوصول من هذا الأصل." }, { status: 403 });
    }

    if (!message) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const response = await getChatResponse(message);

    return NextResponse.json(
      { response },
      {
        headers: {
          // هنا يتم ضبط "Access-Control-Allow-Origin" بشكل ديناميكي
          // إذا كان الأصل مسموحاً به، بنحطه هون.
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبك" }, { status: 500 });
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin'); // الحصول على الأصل (Origin) من رأس الطلب

  let isOriginAllowed = false;
  if (origin) {
    isOriginAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
      if (allowedOrigin === origin) {
        return true;
      }
      if (allowedOrigin.startsWith('.') && origin.endsWith(allowedOrigin)) {
        return true;
      }
      return false;
    });
  }

  // إذا كان الأصل غير مسموح به، ارجع استجابة فارغة مع خطأ 403 Forbidden
  if (!isOriginAllowed) {
      return NextResponse.json({}, { status: 403 });
  }

  return NextResponse.json(
    {},
    {
      headers: {
        // وهنا أيضاً يتم ضبط "Access-Control-Allow-Origin" بشكل ديناميكي لطلبات OPTIONS
        "Access-Control-Allow-Origin": origin || "",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
