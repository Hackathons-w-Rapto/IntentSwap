import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

import { headers } from "next/headers";
import ContextProvider from "@/context/index";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
// import { wagmiAdapter, networks as importedNetworks } from "@/config";

export const metadata: Metadata = {
  title: "IntentSwap - Swap Crypto with Just Words",
  description: "Powered by Somnia Testnet and AI Technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  // RainbowKit expects a Wagmi config
  // The chains are configured via the Wagmi config, not passed directly to RainbowKitProvider

  return (
    <html lang="en">
      <body className={sora.className}>
        <ContextProvider cookies={cookies}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
