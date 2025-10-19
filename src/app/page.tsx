"use client";
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import Features from "@/components/Features";
import { SiProbot } from "react-icons/si";
import { FaBoltLightning } from "react-icons/fa6";
import { GiCheckedShield } from "react-icons/gi";
import { SlMagnifier } from "react-icons/sl";
import AnimatedWordType from "@/components/AnimatedWordType";
import Image from "next/image";

export default function Home() {
  const { authenticated } = usePrivy();
  const [showConnectMsg, setShowConnectMsg] = useState(false);

  return (
    <>
      {showConnectMsg && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-500 text-white text-center py-3 font-semibold shadow-lg">
          Please connect your wallet first to start swapping.
        </div>
      )}
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans relative overflow-x-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" /> */}
        <header
          className={`w-full flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-800/50 bg-black/80 backdrop-blur-sm ${
            showConnectMsg ? "mt-12" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="IntentSwap Logo"
              width={40}
              height={40}
            />
            <h1 className="text-white text-lg font-semibold tracking-wide">
              IntentSwap
            </h1>
          </div>
          <div className="flex items-center">
            <ConnectWalletButton />
          </div>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 relative z-10">
          {/* Hero Section with improved spacing and animations */}
          <div className="text-center max-w-5xl mt-5 mx-auto">
            <h2 className="text-4xl md:text-7xl font-extrabold text-center mb-6 leading-tight">
              <span className="text-white bg-clip-text animate-fade-in">
                SWAP CRYPTO
                <br />
                WITH
                <br />
              </span>
              <AnimatedWordType />
            </h2>

            <p className="text-gray-300 text-md md:text-3xl text-center mb-8 max-w-2xl mx-auto leading-relaxed">
              Grant SpendPermissions once. Send tokens on{" "}
              <span className="text-white font-semibold">Somnia</span> just by
              typing a simple prompt. No complex interfaces, no multiple clicks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
              <div className="flex flex-col items-center">
                <button
                  className="mt-2 px-8 py-4 text-xl font-bold rounded cursor-pointer border-2 border-white bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white shadow-lg hover:scale-105 transition-transform"
                  onClick={() => {
                    if (authenticated) {
                      window.location.href = "/chat";
                    } else {
                      setShowConnectMsg(true);
                    }
                  }}
                >
                  START SWAPPING
                </button>
              </div>

              <Link href="#demo">
                <button className="mt-2 px-8 py-4 text-xl font-bold rounded cursor-pointer border-2  shadow-lg hover:scale-105 transition-transform  border-gray-600 text-white hover:border-white hover:bg-white hover:text-black  duration-300">
                  VIEW DEMO
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-16">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF1E99] rounded-full"></span>
                <span>Somnia Testnet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF1E99] rounded-full"></span>
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF1E99] rounded-full"></span>
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
                <div className="text-[#FF1E99] bg-clip-text   text-sm mb-2">
                  → Input:
                </div>
                <div className="text-white mb-4">
                  &quot;Send 50 STT to Alice&quot;
                </div>
                <div className="text-[#FF1E99] bg-clip-text   text-sm mb-2">
                  ← Parsed:
                </div>
                <div className="text-gray-300 text-sm">
                  Amount: 50, Token: STT, Recipient: Alice
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur border border-gray-700 cursor-pointer rounded-lg p-6 hover:border-purple-500 transition-colors duration-300">
                <div className="text-[#FF1E99]  text-sm mb-2">→ Input:</div>
                <div className="text-white mb-4">
                  &quot;Transfer 100 tokens to 0x123...&quot;
                </div>
                <div className="text-[#FF1E99]  text-sm mb-2">← Parsed:</div>
                <div className="text-gray-300 text-sm">
                  Amount: 100, Token: STT, Recipient: 0x123...
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Features Section */}
          <Features
            features={[
              {
                icon: <SiProbot className="text-white" />,
                title: "AI Prompt Parsing",
                description:
                  "Advanced natural language processing to understand your swap intentions perfectly.",
              },
              {
                icon: <FaBoltLightning className="text-yellow-400" />,
                title: "Lightning Fast",
                description:
                  "Execute transfers on Somnia testnet with minimal gas fees and instant confirmations.",
              },
              {
                icon: <GiCheckedShield className="text-white" />,
                title: "Secure & Safe",
                description:
                  "Multiple confirmation layers and safety checks before every transaction.",
              },
              {
                icon: <SlMagnifier className="text-white" />,
                title: "Full Transparency",
                description:
                  "Complete transaction history and real-time status updates for all your swaps.",
              },
            ]}
          />
        </main>

        <footer className="w-full flex flex-col items-center justify-center py-8 border-t border-gray-800 bg-black/80 backdrop-blur relative z-10">
          <div className="text-sm text-gray-400 text-center max-w-xl mb-4">
            Built for the{" "}
            <span className="text-white font-semibold">
              Somnia AI Hackathon
            </span>{" "}
            • Making crypto transfers as easy as sending a text message.
          </div>
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
              href="https://www.loom.com/share/aabf4d44adc94fcfb8c1ebf3d33d5044?sid=2294e122-09e7-437d-8c05-d95cc3b590a9"
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
    </>
  );
}
