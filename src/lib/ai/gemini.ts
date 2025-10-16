import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedIntent } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const hasApiKey = !!apiKey;
const genAI = new GoogleGenerativeAI(apiKey || "dummy");

export class GeminiParser {
  private model: any | null = null;

  constructor() {
    if (hasApiKey) {
      this.model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.5-preview" });
    }
  }

  private regexFallback(userMessage: string): ParsedIntent | null {
    const text = userMessage.trim();
    // Patterns: "send 50 STT to 0xabc" | "transfer 10 to Alice" | "pay Bob 5 STT"
    const patterns: RegExp[] = [
      /\b(send|transfer)\s+(\d+(?:\.\d+)?)\s*([a-zA-Z]{2,10})?\s*to\s+(.+)/i,
      /\bpay\s+(.+?)\s+(\d+(?:\.\d+)?)\s*([a-zA-Z]{2,10})?/i,
      /\b(?:check|show|what(?:'|)s|what is)\s+(?:my\s+)?balance\b(?:\s+of\s+([a-zA-Z]{2,10}))?/i,
    ];

    for (const pattern of patterns) {
      const m = text.match(pattern);
      if (!m) continue;
      if (/pay/i.test(pattern.source)) {
        const recipient = m[1];
        const amount = m[2];
        const token = (m[3] || "STT").toUpperCase();
        return { action: "pay", amount, token, recipient, confidence: 0.9 };
      }
      if (/send\|transfer/.test(pattern.source)) {
        const action = (m[1] || "transfer").toLowerCase() as ParsedIntent["action"];
        const amount = m[2];
        const token = (m[3] || "STT").toUpperCase();
        const recipient = m[4];
        return { action: action as any, amount, token, recipient, confidence: 0.9 };
      }
      if (/balance/.test(pattern.source)) {
        const token = ((m[1] as string) || "STT").toUpperCase();
        // Use balance action; amount/recipient not needed
        return { action: "balance", amount: "0", token, recipient: "", confidence: 0.9 } as any;
      }
    }
    return null;
  }

  async parseIntent(userMessage: string): Promise<ParsedIntent | null> {
    if (!hasApiKey || !this.model) {
      return this.regexFallback(userMessage);
    }
    try {
      const prompt = `
  You are a transaction intent parser for a blockchain wallet. Parse the following message and extract transaction details.
  
  User message: "${userMessage}"
  
  Extract the following information:
  1. Action type: transfer/send/pay for transactions, OR balance/check/balance_check for balance inquiries
  2. Amount (numeric value) - required ONLY for transfer actions
  3. Token symbol (default to STT if not specified)
  4. Recipient (wallet address or name) - required ONLY for transfer actions
  
  Examples:
  - "Send 50 STT to Alice" -> {"action": "transfer", "amount": "50", "token": "STT", "recipient": "Alice", "confidence": 0.95}
  - "Check my balance" -> {"action": "balance", "amount": null, "token": "STT", "recipient": null, "confidence": 0.95}
  - "What's my STT balance?" -> {"action": "balance", "amount": null, "token": "STT", "recipient": null, "confidence": 0.95}
  - "Transfer 100 tokens to 0x123..." -> {"action": "transfer", "amount": "100", "token": "STT", "recipient": "0x123...", "confidence": 0.95}
  
  Return ONLY a JSON object in this exact format:
  {
    "action": "transfer" | "balance" | null,
    "amount": "50" | null,
    "token": "STT",
    "recipient": "Alice" | null,
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
  - For balance checks: action should be "balance", amount and recipient can be null
  - For transfers: action should be "transfer"/"send"/"pay", amount and recipient are required
  - Amount must be a positive number when specified
  - Token should be uppercase (e.g., STT, USDT)
  - Recipient can be a name or wallet address
  - Confidence should be 0.0 to 1.0
  - Return ONLY the JSON, no markdown formatting
  `;

      const result = await this.model.generateContent(prompt);
      const text = (await result.response).text();
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
  
      // Validate the structure and confidence threshold
      if (parsed.confidence < 0.7 || !parsed.action) {
        return null;
      }

      // For transfer actions, require amount and recipient
      if (["transfer", "send", "pay"].includes(parsed.action.toLowerCase())) {
        if (!parsed.amount || !parsed.recipient) {
          return null;
        }
      }

      // For balance checks, amount and recipient can be null
      if (["balance", "check", "balance_check"].includes(parsed.action.toLowerCase())) {
        parsed.amount = null;
        parsed.recipient = null;
      }
  
      return parsed;
    } catch (error) {
      console.error("Error parsing intent with Gemini, using fallback:", error);
      return this.regexFallback(userMessage);
    }
  }

  async generateResponse(context: string, userMessage: string, senderAddress: string): Promise<string> {
    if (!hasApiKey || !this.model) {
      // Simple fallback text
      return `You said: "${userMessage}". I can help send tokens or check balances.`;
    }
    try {
      const prompt = `You are IntentSwap AI, a friendly blockchain transaction assistant. 

Context: ${context}
User message: "${userMessage}"
The current user's wallet address is: ${senderAddress ?? "Unknown"}.

Generate a helpful, concise response. Do not lie. If you can't do it just be staright forward with your answers. Keep it conversational and friendly. 
If there's an error, explain it clearly and suggest how to fix it.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble processing that. Please try again.";
    }
  }
}