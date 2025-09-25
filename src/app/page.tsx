
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
      <header className="w-full flex justify-between items-center px-8 py-6 border-b border-white">
        <h1 className="text-white text-2xl font-bold tracking-wide">
          INTENTSWAP
        </h1>
        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm"
          >
            GITHUB
          </a>
          <button className="bg-[#1E3DFF] text-white px-4 py-2 rounded font-semibold text-sm">
            SIGN IN
          </button>
          <ConnectWalletButton />
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h2 className="text-5xl sm:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] bg-clip-text text-transparent">
          SWAP CRYPTO
          <br />
          WITH JUST WORDS.
        </h2>
        <p className="text-white text-lg text-center mb-8 max-w-xl">
          Grant SpendPermissions once. Our AI agent executes swaps for you.
        </p>
        <Link href="/chat">
          <button className="mt-2 px-8 py-4 text-xl font-bold rounded border-2 border-white bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white shadow-lg hover:scale-105 transition-transform">
            START SWAPPING
          </button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
          <div className="bg-black border-2 border-white rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🤖</span>
            <h3 className="text-white font-bold text-lg mb-2">AI-POWERED</h3>
            <p className="text-white text-center text-sm">
              Natural language processing for seamless swaps.
            </p>
          </div>
          <div className="bg-black border-2 border-white rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⚡</span>
            <h3 className="text-white font-bold text-lg mb-2">
              INSTANT EXECUTION
            </h3>
            <p className="text-white text-center text-sm">
              Pre-approved permissions mean fast, secure transactions.
            </p>
          </div>
          <div className="bg-black border-2 border-white rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🔒</span>
            <h3 className="text-white font-bold text-lg mb-2">
              SECURE BY DESIGN
            </h3>
            <p className="text-white text-center text-sm">
              Built on Base with robust security and privacy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
