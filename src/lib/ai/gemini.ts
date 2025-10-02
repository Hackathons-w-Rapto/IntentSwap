import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedIntent } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class GeminiParser {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async parseIntent(userMessage: string): Promise<ParsedIntent | null> {
    try {
      const prompt = `You are a transaction intent parser. Parse the following message and extract transaction details.

User message: "${userMessage}"

Extract the following information:
1. Action type (transfer/send/pay)
2. Amount (numeric value)
3. Token symbol (default to STT if not specified)
4. Recipient (wallet address or name)

Return ONLY a JSON object in this exact format:
{
  "action": "transfer",
  "amount": "50",
  "token": "STT",
  "recipient": "Alice",
  "confidence": 0.95
}

If you cannot parse the intent with confidence above 0.7, return:
{
  "action": null,
  "amount": null,
  "token": null,
  "recipient": null,
  "confidence": 0.0
}

Rules:
- Amount must be a positive number
- Token should be uppercase (e.g., STT, USDT)
- Recipient can be a name or wallet address
- Confidence should be 0.0 to 1.0
- Return ONLY the JSON, no markdown formatting`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response - remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      // Validate the parsed result
      if (
        parsed.confidence < 0.7 ||
        !parsed.action ||
        !parsed.amount ||
        !parsed.recipient
      ) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing intent with Gemini:", error);
      return null;
    }
  }

  async generateResponse(context: string, userMessage: string): Promise<string> {
    try {
      const prompt = `You are IntentSwap AI, a friendly blockchain transaction assistant. 

Context: ${context}
User message: "${userMessage}"

Generate a helpful, concise response. Keep it conversational and friendly. 
If there's an error, explain it clearly and suggest how to fix it.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble processing that. Please try again.";
    }
  }
}