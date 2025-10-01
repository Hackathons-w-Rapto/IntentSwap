import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface TransactionIntent {
  amount: string;
  token: string;
  recipient: string;
  confidence: number;
}

interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a system prompt for transaction intent parsing
    const systemPrompt = `You are an AI assistant for IntentSwap, a blockchain transaction platform on Somnia testnet. 
Your job is to parse user messages and extract transaction intents.

When a user wants to send tokens, extract:
1. Amount (numeric value)
2. Token symbol (default to "STT" if not specified)
3. Recipient (name, address, or identifier)

Common patterns:
- "Send X tokens to Y"
- "Transfer X STT to Y"
- "Pay Y X tokens"
- "Give Y X STT"

If you detect a valid transaction intent, respond with a JSON object in this format:
{
  "type": "transaction_intent",
  "data": {
    "amount": "50",
    "token": "STT",
    "recipient": "Alice",
    "confidence": 0.95
  }
}

If the message is unclear or not a transaction request, respond with:
{
  "type": "clarification",
  "message": "Your helpful response here"
}

If the user is just chatting or asking questions, respond naturally but keep it concise.
Always be helpful and friendly. If you're unsure about a transaction detail, ask for clarification.`;

    // Build chat history for context
    const chatHistory: ChatMessage[] = [
      {
        role: "user",
        parts: systemPrompt,
      },
      {
        role: "model",
        parts:
          "I understand. I'll help parse transaction intents and respond appropriately.",
      },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        chatHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: msg.text,
        });
      });
    }

    // Add current message
    chatHistory.push({
      role: "user",
      parts: message,
    });

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    // Try to parse as JSON first
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, treat as regular text response
      parsedResponse = {
        type: "text",
        message: responseText,
      };
    }

    // Return the structured response
    return NextResponse.json({
      success: true,
      response: parsedResponse,
      rawText: responseText,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error.message,
      },
      { status: 500 }
    );
  }
}