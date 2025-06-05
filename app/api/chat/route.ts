import { type NextRequest, NextResponse } from "next/server"
import { getChatResponse } from "@/actions/chat-actions"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 })
    }

    const response = await getChatResponse(message)

    return NextResponse.json(
      { response },
      {
        headers: {
          "Access-Control-Allow-Origin": "https://naturae-syria.github.io",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    )
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبك" }, { status: 500 })
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "https://naturae-syria.github.io",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  )
}
