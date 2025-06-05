import { NextRequest, NextResponse } from "next/server";
import { handler as whatsappHandler } from "@/functions/whatsapp.js";

async function callHandler(method: string, req: NextRequest) {
  if (method === "GET") {
    const params: Record<string, string> = {};
    req.nextUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return whatsappHandler({
      httpMethod: "GET",
      queryStringParameters: params,
    });
  }

  const body = await req.text();
  return whatsappHandler({ httpMethod: method, body });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://naturae-syria.github.io",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(request: NextRequest) {
  const result = await callHandler("GET", request);
  return new NextResponse(result.body, {
    status: result.statusCode,
    headers: corsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  const result = await callHandler("POST", request);
  return new NextResponse(result.body, {
    status: result.statusCode,
    headers: corsHeaders(),
  });
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
