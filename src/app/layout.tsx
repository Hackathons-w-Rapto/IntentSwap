import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

import { headers } from "next/headers"; // added
import ContextProvider from "@/context/index";

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

  return (
    <html lang="en">
      <body className={sora.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
