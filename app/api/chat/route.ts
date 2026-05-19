import OpenAI from "openai";
import { NextResponse } from "next/server";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  // هذا ملف جانب الخادم فقط — تسجيل واضح عند غياب المفتاح يساعد في تتبّع الأخطاء
  console.error("Missing API key: process.env.GROQ_API_KEY");
}

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: apiKey,
});

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Server: missing API key" }, { status: 500 });
    }

    const body = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: body.messages,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices?.[0]?.message ?? null,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
