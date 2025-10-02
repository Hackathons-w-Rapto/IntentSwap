"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import ChatSidebar from "@/components/ChatSidebar";
import { Separator } from "@/components/ui/separator";
import { FaMicrophone } from "react-icons/fa6";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
  type?: "normal" | "transaction" | "confirmation" | "error";
  transactionData?: {
    amount: string;
    token: string;
    recipient: string;
    txHash?: string;
    status?: "pending" | "confirmed" | "failed";
  };
}

interface TransactionConfirmation {
  amount: string;
  token: string;
  recipient: string;
  gasEstimate: string;
}
export default function ChatPage() {
  const Defaulttoken = "STT";
  const { isConnected, address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "agent",
      text: ' Welcome to IntentSwap! I can help you transfer tokens on Somnia testnet using simple commands. Try saying something like:\n\n• "Send 50 STT to Alice"\n• "Transfer 100 tokens to 0x123..."\n• "Pay Bob 25 STT"',
      timestamp: new Date(),
      type: "normal",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<TransactionConfirmation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock AI parsing function
  // const parseIntent = (text: string): TransactionConfirmation | null => {
  //   // const lowerText = text.toLowerCase();

  //   // Simple regex patterns for demo
  //   const patterns = [
  //     /send (\d+(?:\.\d+)?)\s*(stt|tokens?)?\s*to\s*(.+)/i,
  //     /transfer (\d+(?:\.\d+)?)\s*(stt|tokens?)?\s*to\s*(.+)/i,
  //     /pay (.+?)\s*(\d+(?:\.\d+)?)\s*(stt|tokens?)?/i,
  //   ];

  //   for (const pattern of patterns) {
  //     const match = text.match(pattern);
  //     if (match) {
  //       if (pattern.source.includes("pay")) {
  //         // Handle "pay X amount" format
  //         return {
  //           amount: match[2],
  //           token: match[3]?.toUpperCase() || "STT",
  //           recipient: match[1],
  //           gasEstimate: "0.001 ETH",
  //         };
  //       } else {
  //         // Handle "send/transfer amount to recipient" format
  //         return {
  //           amount: match[1],
  //           token: match[2]?.toUpperCase() || "STT",
  //           recipient: match[3],
  //           gasEstimate: "0.001 ETH",
  //         };
  //       }
  //     }
  //   }
  //   return null;
  // };

  async function fetchIntentResponse(message: string, context?: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
    const data = await res.json();
    return data;
  }

  async function fetchBalance(address: string, token: string) {
    const res = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, token }),
    });
    const data = await res.json();
    return data;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });
    const userInput = input;
    setInput("");
    simulateTyping();

    try {
      const response = await fetchIntentResponse(userInput);
      setIsTyping(false);
      if (response.data && response.success) {
        const userAddress = address || "";
        const token = Defaulttoken || "STT";
        const balanceRes = await fetchBalance(userAddress, token);
        let balanceText = "";
        if (balanceRes.success && balanceRes.data) {
          balanceText = `Your balance: ${balanceRes.data.balance} ${token}`;
        } else {
          balanceText = "Unable to fetch balance.";
        }
        addMessage({
          sender: "agent",
          text: `I understand you want to transfer ${response.data.amount} ${response.data.token} to ${response.data.recipient}.
${balanceText}\n\nPlease confirm the transaction details below:`,
          type: "confirmation",
        });
        setPendingConfirmation(response);
      } else {
        addMessage({
          sender: "agent",
          text: response.error || "Sorry, I couldn't process that.",
          type: "error",
        });
      }
    } catch (error) {
      addMessage({
        sender: "agent",
        text: "Server error. Please try again.",
        type: "error",
      });
      throw new Error("Error fetching intent response");
      console.error("Error fetching intent response:", error);
    }
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 800);
  };

  const confirmTransaction = () => {
    if (!pendingConfirmation) return;

    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    addMessage({
      sender: "agent",
      text: `Transaction submitted! \n\nYour transfer is being processed on Somnia testnet.`,
      type: "transaction",
      transactionData: {
        ...pendingConfirmation,
        txHash,
        status: "pending",
      },
    });

    setPendingConfirmation(null);

    // Simulate confirmation after delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.transactionData?.txHash === txHash
            ? {
                ...msg,
                text: `Transaction confirmed!\n\nSuccessfully transferred ${pendingConfirmation.amount} ${pendingConfirmation.token} to ${pendingConfirmation.recipient}`,
                transactionData: {
                  ...msg.transactionData!,
                  status: "confirmed",
                },
              }
            : msg
        )
      );
    }, 3000);
  };

  const cancelTransaction = () => {
    setPendingConfirmation(null);
    addMessage({
      sender: "agent",
      text: "Transaction cancelled. Feel free to try another command!",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-black flex font-sans">
      {/* Sidebar */}
      <ChatSidebar />
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className=" backdrop-blur-sm p-4">
          <div className="max-w-5xl mx-auto py-0.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">
                  IntentSwap Chat
                </h1>
                <p className="text-sm text-gray-400">
                  AI-powered token transfers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-400">Connected</span>
                </>
              ) : (
                <ConnectWalletButton />
              )}
            </div>
          </div>
          <Separator />
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[calc(100vh-200px)]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.sender === "user" ? "order-2" : ""
                  }`}
                >
                  {/* Message bubble */}
                  <div
                    className={`px-6 py-3 rounded-2xl relative ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white"
                        : msg.type === "error"
                        ? "bg-red-900/50 border border-red-500 text-white"
                        : msg.type === "confirmation"
                        ? "bg-yellow-900/50 border border-yellow-500 text-white"
                        : msg.type === "transaction"
                        ? "bg-green-900/50 border border-green-500 text-white"
                        : "bg-gray-800 text-white border border-gray-600"
                    }`}
                  >
                    {/* Message icon */}
                    {msg.sender === "agent" && (
                      <div
                        className={`absolute -left-0 mx-2 top-3 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          msg.type === "error"
                            ? "bg-red-500"
                            : msg.type === "confirmation"
                            ? "bg-yellow-500"
                            : msg.type === "transaction"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      >
                        {msg.type === "error"
                          ? "⚠️"
                          : msg.type === "confirmation"
                          ? "❓"
                          : msg.type === "transaction"
                          ? "✅"
                          : "🤖"}
                      </div>
                    )}

                    <p className="whitespace-pre-line leading-relaxed ml-6">
                      {msg.text}
                    </p>

                    {/* Transaction details */}
                    {msg.transactionData && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg border border-gray-600">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Amount:</span>
                            <span className="ml-2 font-semibold">
                              {msg.transactionData.amount}{" "}
                              {msg.transactionData.token}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">To:</span>
                            <span className="ml-2 font-mono text-xs">
                              {msg.transactionData.recipient}
                            </span>
                          </div>
                        </div>

                        {msg.transactionData.txHash && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-400 text-sm">TX:</span>
                            <button
                              onClick={() =>
                                copyToClipboard(msg.transactionData!.txHash!)
                              }
                              className="text-blue-400 hover:text-blue-300 text-xs font-mono flex items-center gap-1"
                            >
                              {msg.transactionData.txHash.slice(0, 10)}...
                              <Copy className="w-3 h-3" />
                            </button>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-2">
                          {msg.transactionData.status === "pending" && (
                            <>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                              <span className="text-yellow-400 text-sm">
                                Pending...
                              </span>
                            </>
                          )}
                          {msg.transactionData.status === "confirmed" && (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm">
                                Confirmed
                              </span>
                            </>
                          )}
                          {msg.transactionData.status === "failed" && (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm">
                                Failed
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      msg.sender === "user" ? "text-right" : "text-left ml-5"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl border border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Confirmation Panel */}
          {pendingConfirmation && (
            <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-xl">
              <h3 className="text-yellow-400 font-semibold mb-3">
                Confirm Transaction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-white font-semibold">
                    {pendingConfirmation.amount} {pendingConfirmation.token}
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Recipient</p>
                  <p className="text-white font-semibold text-sm">
                    {pendingConfirmation.recipient}
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Gas Fee</p>
                  <p className="text-white font-semibold">
                    {pendingConfirmation.gasEstimate}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmTransaction}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all"
                >
                  Confirm & Send
                </button>
                <button
                  onClick={cancelTransaction}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Type your command... (e.g., 'Send 50 STT to Alice')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isTyping || !!pendingConfirmation}
              />
              <FaMicrophone
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                style={{ pointerEvents: "auto" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping || !!pendingConfirmation}
              className="px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Send 50 STT to Alice",
              "Transfer 100 tokens to 0x123...",
              "Pay Bob 25 STT",
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInput(suggestion)}
                className="text-sm px-3 py-1 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white transition-all"
                disabled={isTyping || !!pendingConfirmation}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
