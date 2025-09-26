"use client";
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Meteors } from "@/components/ui/meteors";
import { useAccount } from "wagmi";
import { useState } from "react";

export default function Home() {
  const { isConnected } = useAccount();
  const [showConnectMsg, setShowConnectMsg] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black animate-pulse" />
      <header className="w-full flex justify-between items-center px-8 py-6 border-b border-white">
        <h1 className="text-white text-2xl font-bold tracking-wide">
          INTENTSWAP
        </h1>
        <div className="flex gap-4 items-center">
          <ConnectWalletButton />
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 relative z-10">
        {/* Hero Section with improved spacing and animations */}
        <div className="text-center max-w-5xl mt-5 mx-auto">
          <h2 className="text-5xl sm:text-7xl font-extrabold text-center mb-6 leading-tight">
            <span className="text-white bg-clip-text animate-fade-in">
              SWAP CRYPTO
              <br />
              WITH
              <br />
            </span>
            <span className="bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] bg-clip-text text-transparent animate-gradient">
              JUST WORDS.
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            Grant SpendPermissions once. Send tokens on{" "}
            <span className="text-white font-semibold">Somnia</span> just by
            typing a simple prompt. No complex interfaces, no multiple clicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <div className="flex flex-col items-center">
              <button
                className="mt-2 px-8 py-4 text-xl font-bold rounded border-2 border-white bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white shadow-lg hover:scale-105 transition-transform"
                onClick={() => {
                  if (isConnected) {
                    window.location.href = "/chat";
                  } else {
                    setShowConnectMsg(true);
                  }
                }}
              >
                START SWAPPING
              </button>
              {showConnectMsg && (
                <div className="mt-3 text-red-400 font-semibold text-center">
                  Please connect your wallet first to start swapping.
                </div>
              )}
            </div>

            <Link href="#demo">
              <button className="mt-2 px-8 py-4 text-xl font-bold rounded border-2  shadow-lg hover:scale-105 transition-transform  border-gray-600 text-white hover:border-white hover:bg-white hover:text-black  duration-300">
                VIEW DEMO
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-16">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Somnia Testnet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Open Source</span>
            </div>
          </div>
        </div>

        {/* Example Commands Section */}
        <section className="w-full max-w-4xl mx-auto mb-24" id="demo">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Try These Commands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors duration-300">
              <div className="text-green-400 font-mono text-sm mb-2">
                → Input:
              </div>
              <div className="text-white mb-4">
                &quot;Send 50 STT to Alice&quot;
              </div>
              <div className="text-blue-400 font-mono text-sm mb-2">
                ← Parsed:
              </div>
              <div className="text-gray-300 text-sm">
                Amount: 50, Token: STT, Recipient: Alice
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors duration-300">
              <div className="text-green-400 font-mono text-sm mb-2">
                → Input:
              </div>
              <div className="text-white mb-4">
                &quot;Transfer 100 tokens to 0x123...&quot;
              </div>
              <div className="text-blue-400 font-mono text-sm mb-2">
                ← Parsed:
              </div>
              <div className="text-gray-300 text-sm">
                Amount: 100, Token: STT, Recipient: 0x123...
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="w-full max-w-6xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="relative w-full max-w-xs mx-auto group">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] blur-3xl group-hover:scale-[0.85] transition-transform duration-300" />
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black/80 backdrop-blur px-4 py-8 shadow-xl hover:border-purple-500 transition-colors duration-300">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🤖
                </span>
                <h3 className="relative z-50 mb-3 text-lg font-bold text-white">
                  AI Prompt Parsing
                </h3>
                <p className="relative z-50 text-sm font-normal text-gray-300 text-center leading-relaxed">
                  Advanced natural language processing to understand your swap
                  intentions perfectly.
                </p>
                <Meteors number={8} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative w-full max-w-xs mx-auto group">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] blur-3xl group-hover:scale-[0.85] transition-transform duration-300" />
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black/80 backdrop-blur px-4 py-8 shadow-xl hover:border-purple-500 transition-colors duration-300">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </span>
                <h3 className="relative z-50 mb-3 text-lg font-bold text-white">
                  Lightning Fast
                </h3>
                <p className="relative z-50 text-sm font-normal text-gray-300 text-center leading-relaxed">
                  Execute transfers on Somnia testnet with minimal gas fees and
                  instant confirmations.
                </p>
                <Meteors number={8} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative w-full max-w-xs mx-auto group">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] blur-3xl group-hover:scale-[0.85] transition-transform duration-300" />
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black/80 backdrop-blur px-4 py-8 shadow-xl hover:border-purple-500 transition-colors duration-300">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🛡️
                </span>
                <h3 className="relative z-50 mb-3 text-lg font-bold text-white">
                  Secure & Safe
                </h3>
                <p className="relative z-50 text-sm font-normal text-gray-300 text-center leading-relaxed">
                  Multiple confirmation layers and safety checks before every
                  transaction.
                </p>
                <Meteors number={8} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="relative w-full max-w-xs mx-auto group">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] blur-3xl group-hover:scale-[0.85] transition-transform duration-300" />
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black/80 backdrop-blur px-4 py-8 shadow-xl hover:border-purple-500 transition-colors duration-300">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📊
                </span>
                <h3 className="relative z-50 mb-3 text-lg font-bold text-white">
                  Full Transparency
                </h3>
                <p className="relative z-50 text-sm font-normal text-gray-300 text-center leading-relaxed">
                  Complete transaction history and real-time status updates for
                  all your swaps.
                </p>
                <Meteors number={8} />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <section className="w-full max-w-5xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-20 left-1/6 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1E3DFF] to-[#7A1EFF] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⌨️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  1. Type Your Intent
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Simply type what you want to do in plain English. No need to
                  learn complex syntax or remember addresses.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#7A1EFF] to-[#FF1E99] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  2. AI Understanding
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Our advanced AI parses your intent, extracting amounts,
                  recipients, and token types with high accuracy.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF1E99] to-[#1E3DFF] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  3. Instant Execution
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After confirmation, your transaction is executed on Somnia
                  testnet with lightning-fast speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full max-w-4xl mx-auto mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/30 backdrop-blur">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Parse Accuracy</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/30 backdrop-blur">
              <div className="text-3xl font-bold text-white mb-2">&lt;2s</div>
              <div className="text-gray-400 text-sm">Avg Response</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/30 backdrop-blur">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/30 backdrop-blur">
              <div className="text-3xl font-bold text-white mb-2">0.1%</div>
              <div className="text-gray-400 text-sm">Gas Fees</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full flex flex-col items-center justify-center py-8 border-t border-gray-800 bg-black/80 backdrop-blur relative z-10">
        <p className="text-sm text-gray-400 text-center max-w-xl mb-4">
          Built for the{" "}
          <span className="text-white font-semibold">Somnia AI Hackathon</span>{" "}
          • Making crypto transfers as easy as sending a text message.
        </p>
        <div className="flex gap-6">
          <Link
            href="https://github.com/Hackathons-w-Rapto/IntentSwap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            GitHub
          </Link>
          <Link
            href="https://docs.somnia.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Demo Video
          </Link>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
