import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface ParsedIntent {
  amount: string;
  token: string;
  recipient: string;
  confidence: number;
  gasEstimate: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Parse this transaction request and extract the details. Respond ONLY with valid JSON.

User message: "${message}"

Extract:
- amount: The numeric amount (just the number as a string)
- token: The token symbol (default "STT" if not mentioned)
- recipient: The recipient name or address
- confidence: Your confidence level (0.0 to 1.0)

Examples:
Input: "Send 50 STT to Alice"
Output: {"amount": "50", "token": "STT", "recipient": "Alice", "confidence": 0.95}

Input: "Transfer 100 tokens to 0x123abc"
Output: {"amount": "100", "token": "STT", "recipient": "0x123abc", "confidence": 0.90}

Input: "Pay Bob 25"
Output: {"amount": "25", "token": "STT", "recipient": "Bob", "confidence": 0.85}

If you cannot parse a valid transaction, respond with:
{"error": "Could not parse transaction intent", "confidence": 0.0}

Respond only with JSON, no other text:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/g, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const jsonMatch = cleanText.match(/\{.*\}/s);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    }

    if (parsed.error || (parsed.confidence && parsed.confidence < 0.5)) {
      return NextResponse.json({
        success: false,
        error:
          parsed.error ||
          "Could not parse transaction intent with sufficient confidence",
      });
    }

    const intentData: ParsedIntent = {
      amount: parsed.amount,
      token: parsed.token || "STT",
      recipient: parsed.recipient,
      confidence: parsed.confidence || 0.8,
      gasEstimate: "0.001 ETH",
    };

    if (
      !intentData.amount ||
      !intentData.recipient ||
      isNaN(parseFloat(intentData.amount))
    ) {
      return NextResponse.json({
        success: false,
        error: "Invalid transaction details extracted",
      });
    }

    return NextResponse.json({
      success: true,
      intent: intentData,
    });
  } catch (error: any) {
    console.error("Parse Intent Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to parse intent",
        details: error.message,
      },
      { status: 500 }
    );
  }
}