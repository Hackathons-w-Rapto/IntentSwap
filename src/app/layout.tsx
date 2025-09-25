import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { headers } from "next/headers"; // added
import ContextProvider from "@/context/index";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
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
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          <ConnectWalletButton />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
