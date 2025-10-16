import { NextRequest, NextResponse } from "next/server";
import { GeminiParser } from "@/lib/ai/gemini";
import { BlockchainClient } from "@/lib/blockchain/client";
import { SupportedToken, TOKEN_ADDRESSES } from "@/lib/blockchain/config";

export async function POST(req: NextRequest) {
  try {
    const { message, context, senderAddress } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!senderAddress) {
      return NextResponse.json({ error: "Please provide a sender address" }, { status: 400 });
    }

    // ✅ Format conversation context into readable form for AI
    const formattedContext = Array.isArray(context)
      ? context
          .map((msg) => `${msg.sender === "user" ? "User" : "Agent"}: ${msg.text}`)
          .join("\n")
      : "General conversation";

    const parser = new GeminiParser();
    const blockchain = new BlockchainClient();

    // ✅ 1️⃣ Try to find previous intent in context (e.g., last transfer)
    let previousIntent = null;
    if (Array.isArray(context)) {
      const lastAgentMessage = [...context].reverse().find(
        (msg) =>
          msg.sender === "agent" &&
          /sending|transfer|prepare|estimated gas/i.test(msg.text)
      );

      if (lastAgentMessage) {
        try {
          previousIntent = await parser.parseIntent(lastAgentMessage.text);
        } catch (err) {
          console.warn("Could not parse previous intent:", err);
        }
      }
    }

    // ✅ 2️⃣ Parse the current user message
    let intent = await parser.parseIntent(message);

    // ✅ If user confirms but no new intent, reuse previous one
    if (
      !intent &&
      previousIntent &&
      /\b(yes|confirm|proceed|ok|okay|sure|go ahead|do it)\b/i.test(message)
    ) {
      intent = previousIntent;
    }

    // ✅ If still no intent — fallback to Gemini text reply
    if (!intent) {
      const fallbackResponse = await parser.generateResponse(
        formattedContext,
        message,
        senderAddress
      );
      return NextResponse.json({
        success: true,
        message: "AI Response (no intent)",
        response: fallbackResponse,
        intent: null,
      });
    }

    // ✅ 3️⃣ Act on the parsed intent
    let actionResult: any = null;
    let aiResponse: string = "";

    switch (intent.action?.toLowerCase()) {
      case "transfer":
      case "send":
      case "pay": {
        // Resolve recipient
        const resolved = await blockchain.resolveAddress(intent.recipient);
        const recipient = resolved || intent.recipient;
        const tokenAddress =
          TOKEN_ADDRESSES[intent.token as SupportedToken] || null;

        // Estimate gas
        const gasEstimate = await blockchain.estimateGas(
          senderAddress,
          recipient,
          intent.amount,
          tokenAddress as string
        );

        aiResponse = `You're sending ${intent.amount} ${intent.token} to ${recipient}.
Estimated gas: ${gasEstimate} STT.
Would you like me to prepare the transaction?`;

        actionResult = {
          recipient,
          gasEstimate,
          amount: intent.amount,
          token: intent.token,
        };
        break;
      }

      case "balance":
      case "check":
      case "balance_check": {
        const tokenAddress =
          TOKEN_ADDRESSES[intent.token as SupportedToken] || null;
        const balance = await blockchain.getBalance(
          senderAddress,
          tokenAddress as string
        );

        aiResponse = `Your current ${intent.token || "native"} balance is ${balance}.`;
        actionResult = { balance, token: intent.token || "STT" };
        break;
      }

      default: {
        aiResponse = await parser.generateResponse(formattedContext, message, senderAddress);
        break;
      }
    }

    // ✅ 4️⃣ Return combined response
    return NextResponse.json({
      success: true,
      message: "AI Response",
      response: aiResponse,
      intent,
      actionResult,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
