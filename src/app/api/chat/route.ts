import { NextRequest, NextResponse } from "next/server";
import { GeminiParser } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, context, senderAddress } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!senderAddress) {
      return NextResponse.json(
        { error: "Please provide a sender address" },
        { status: 400 }
      );
    }

    // ✅ Convert structured context into readable chat history
    const formattedContext = Array.isArray(context)
      ? context
          .map(
            (msg) =>
              `${msg.sender === "user" ? "User" : "Agent"}: ${msg.text}`
          )
          .join("\n")
      : "General conversation";

    const parser = new GeminiParser();

    const intent = await parser.parseIntent(message);

    // ✅ Pass the sender address into the Gemini prompt
    const response = await parser.generateResponse(
      formattedContext,
      message,
      senderAddress
    );

    return NextResponse.json({
      success: true,
      message: "AI Response",
      response,
      intent
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
