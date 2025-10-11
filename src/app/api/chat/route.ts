import { NextRequest, NextResponse } from "next/server";
import { GeminiParser } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const parser = new GeminiParser();
    const response = await parser.generateResponse(
      context || "General conversation",
      message
    );
    console.log(response);

    return NextResponse.json({
      success: true,
      message: "AI Response",
      response,
    });
    
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}