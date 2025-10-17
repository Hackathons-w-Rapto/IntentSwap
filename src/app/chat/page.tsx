"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { TOKEN_ADDRESSES, SOMNIA_CONFIG } from "@/lib/blockchain/config";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FaMicrophone } from "react-icons/fa6";
import { ethers } from "ethers";

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
    txReciept?: string;
    status?: "pending" | "confirmed" | "failed";
  };
}

interface TransactionConfirmation {
  amount: string;
  token: string;
  recipient: string;
  gasEstimate: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}
export default function ChatPage() {
  const Defaulttoken = "STT";
  const { authenticated, user } = usePrivy();
  const address = user?.wallet?.address;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<TransactionConfirmation | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate chat title from first user message
  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(" ").slice(0, 4);
    return words.join(" ") + (firstMessage.split(" ").length > 4 ? "..." : "");
  };

  // Save chat sessions to localStorage
  const saveChatSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem(
        "intentswap_chat_sessions",
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error("Failed to save chat sessions:", error);
    }
  };

  // Load chat sessions from localStorage
  const loadChatSessions = (): ChatSession[] => {
    try {
      const stored = localStorage.getItem("intentswap_chat_sessions");
      if (stored) {
        const sessions = JSON.parse(stored) as Array<{
          id: string;
          title: string;
          timestamp: string;
          messages: Array<{
            id: string;
            sender: "user" | "agent";
            text: string;
            timestamp: string;
            type?: "normal" | "transaction" | "confirmation" | "error";
            transactionData?: {
              amount: string;
              token: string;
              recipient: string;
              txReciept?: string;
              status?: "pending" | "confirmed" | "failed";
            };
          }>;
        }>;

        // Convert timestamp strings back to Date objects
        return sessions.map((session) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          messages: session.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
    }
    return [];
  };

  // Create new chat session
  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "agent",
      text: ' Welcome to IntentSwap! I can help you transfer tokens on Somnia testnet using simple commands. Try saying something like:\n\n• "Send 50 STT to Alice"\n• "Transfer 100 tokens to 0x123..."\n• "Pay Bob 25 STT"',
      timestamp: new Date(),
      type: "normal",
    };

    setMessages([welcomeMessage]);
    setCurrentChatId(newChatId);
    setPendingConfirmation(null);
  };

  // Switch to existing chat
  const switchToChat = (chatId: string) => {
    const session = chatHistory.find((chat) => chat.id === chatId);
    if (session) {
      setMessages(session.messages);
      setCurrentChatId(chatId);
      setPendingConfirmation(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    const loadedSessions = loadChatSessions();
    setChatHistory(loadedSessions);

    // Create new chat if no current chat
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId]);

  // Save current chat whenever messages change
  useEffect(() => {
    if (messages.length > 1 && currentChatId) {
      // Only save if there are messages beyond welcome
      const userMessages = messages.filter((msg) => msg.sender === "user");
      if (userMessages.length === 0) return; // Don't save if no user messages

      const title = generateChatTitle(userMessages[0].text);

      const updatedHistory = [...chatHistory];
      const existingIndex = updatedHistory.findIndex(
        (chat) => chat.id === currentChatId
      );

      const chatSession: ChatSession = {
        id: currentChatId,
        title,
        timestamp: new Date(),
        messages: messages,
      };

      if (existingIndex >= 0) {
        updatedHistory[existingIndex] = chatSession;
      } else {
        updatedHistory.unshift(chatSession); // Add to beginning
      }

      setChatHistory(updatedHistory);
      saveChatSessions(updatedHistory);
    }
  }, [messages, currentChatId, chatHistory]);

  async function fetchIntentResponse(message: string, context: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, senderAddress: address }),
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

  async function fetchTransaction(txHash: string) {
    const res = await fetch("/api/transaction-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash }),
    });

    const data = await res.json();
    return data;
  }

  // Helper function to send a real transaction
  async function sendRealTransaction({
    recipient,
    amount,
    token,
  }: TransactionConfirmation) {
    if (!window.ethereum) {
      throw new Error(
        "Ethereum provider not found. Please connect your wallet."
      );
    }

    // Create provider and signer from the user's wallet
    const provider = new ethers.BrowserProvider(
      window.ethereum as unknown as ethers.Eip1193Provider
    );

    // Ensure correct network (Somnia Testnet)
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== SOMNIA_CONFIG.chainId) {
      const chainIdHex = "0x" + SOMNIA_CONFIG.chainId.toString(16);
      try {
        const ethProvider = window.ethereum as unknown as {
          request: (args: {
            method: string;
            params?: unknown[];
          }) => Promise<unknown>;
        };
        await ethProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchErr: unknown) {
        if (
          typeof switchErr === "object" &&
          switchErr !== null &&
          (switchErr as { code?: number }).code === 4902
        ) {
          const ethProvider = window.ethereum as unknown as {
            request: (args: {
              method: string;
              params?: unknown[];
            }) => Promise<unknown>;
          };
          await ethProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: SOMNIA_CONFIG.chainName,
                nativeCurrency: SOMNIA_CONFIG.nativeCurrency,
                rpcUrls: [SOMNIA_CONFIG.rpcUrl],
                blockExplorerUrls: [SOMNIA_CONFIG.blockExplorer],
              },
            ],
          });
        } else {
          throw switchErr;
        }
      }
    }

    const signer = await provider.getSigner();

    // Resolve and validate recipient first
    let to = recipient.trim();
    if (!ethers.isAddress(to)) {
      try {
        const res = await fetch("/api/resolve-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nameOrAddress: to }),
        });
        const data = await res.json();
        if (data?.success && data?.address && ethers.isAddress(data.address)) {
          to = data.address;
        } else {
          throw new Error("Invalid recipient address");
        }
      } catch {
        throw new Error("Could not resolve recipient address");
      }
    }

    // Handle native token (STT) vs ERC20 token
    if (token === "STT") {
      // Native token transfer
      const amountWei = ethers.parseEther(amount);
      const tx = await signer.sendTransaction({
        to,
        value: amountWei,
      });
      return tx.hash;
    }

    const tokenAddress = TOKEN_ADDRESSES[token as keyof typeof TOKEN_ADDRESSES];
    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported`);
    }

    // ERC20 ABI for transfer
    const ERC20_ABI = [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)",
    ];

    // Create contract instance
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    // Convert amount to correct decimals
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    // Send transaction and get the hash
    const tx = await contract.transfer(to, amountWei);
    return tx.hash;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ensure we have a current chat
    if (!currentChatId) {
      createNewChat();
    }

    addMessage({ sender: "user", text: input });
    const userInput = input;
    setInput("");
    simulateTyping();

    try {
      const response = await fetchIntentResponse(userInput, [...messages]);
      setIsTyping(false);
      // Interpret API response shape
      if (response?.success && response?.intent && response?.actionResult) {
        const data: TransactionConfirmation = {
          amount: response.intent.amount,
          token: response.intent.token || Defaulttoken,
          recipient:
            response.actionResult.recipient || response.intent.recipient,
          gasEstimate: response.actionResult.gasEstimate || "~",
        };

        const userAddress = address || "";
        const token = data.token || Defaulttoken;
        const balanceRes = await fetchBalance(userAddress, token);
        const balanceText =
          balanceRes?.success && balanceRes?.balance
            ? `Your balance: ${balanceRes.balance} ${token}`
            : "Unable to fetch balance.";

        addMessage({
          sender: "agent",
          text: `I understand you want to transfer ${data.amount} ${data.token} to ${data.recipient}.
${balanceText}\n\nPlease confirm the transaction details below:`,
          type: "confirmation",
        });
        setPendingConfirmation(data);
      } else if (response?.response) {
        addMessage({
          sender: "agent",
          text: response.response,
          type: "normal",
        });
      } else {
        addMessage({
          sender: "agent",
          text: "Sorry, I couldn't process that.",
          type: "error",
        });
      }
    } catch (error: unknown) {
      addMessage({
        sender: "agent",
        text: "Server error. Please try again.",
        type: "error",
      });

      if (error instanceof Error) {
        throw new Error(`Error fetching intent response: ${error.message}`);
      } else {
        throw new Error("Error fetching intent response");
      }
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

    // setTimeout(() =>
    //   setIsTyping(false),
    // 800);
  };

  const confirmTransaction = async () => {
    if (!pendingConfirmation) return;

    // Send real transaction and get hash
    const txHash = await sendRealTransaction(pendingConfirmation);

    // Fetch transaction status/receipt
    const txReceipt = await fetchTransaction(txHash);

    addMessage({
      sender: "agent",
      text: `Transaction submitted! \n\nYour transfer is being processed on Somnia testnet.`,
      type: "transaction",
      transactionData: {
        ...pendingConfirmation,
        txReciept: txHash,
        status: txReceipt.status || "pending",
      },
    });

    setPendingConfirmation(null);

    //  update status after a delay or on receipt change
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.transactionData?.txReciept === txHash
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
      {/* Collapsible Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-white">IntentSwap</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            variant="outline"
            onClick={createNewChat}
            className={cn(
              "w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white",
              sidebarCollapsed && "px-2"
            )}
          >
            <Plus className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">New Chat</span>}
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-2">
          {!sidebarCollapsed && (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => switchToChat(chat.id)}
                  className={cn(
                    "w-full justify-start text-left text-gray-300 hover:bg-gray-800 hover:text-white h-auto p-3",
                    currentChatId === chat.id && "bg-gray-800 text-white"
                  )}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
          {sidebarCollapsed && (
            <div className="space-y-2 py-2">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => switchToChat(chat.id)}
                  className={cn(
                    "w-full p-2 text-gray-300 hover:bg-gray-800 hover:text-white",
                    currentChatId === chat.id && "bg-gray-800 text-white"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
              sidebarCollapsed && "px-2"
            )}
          >
            <Settings className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
              sidebarCollapsed && "px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>

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
              {authenticated ? (
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
                        : "bg-gray-900 text-white border border-gray-600"
                    }`}
                  >
                    <p className="whitespace-pre-line  leading-relaxed ml-1">
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

                        {msg.transactionData.txReciept && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-400 text-sm">TX:</span>
                            <button
                              onClick={() =>
                                copyToClipboard(msg.transactionData!.txReciept!)
                              }
                              className="text-blue-400 hover:text-blue-300 text-xs font-mono flex items-center gap-1"
                            >
                              {msg.transactionData.txReciept.slice(0, 10)}...
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
