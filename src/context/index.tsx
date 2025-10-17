"use client";

import React, { type ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { privyAppId, supportedChains } from "@/config";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

export default function ContextProvider({ children }: Props) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Customize the login UI
        appearance: {
          theme: "dark",
          accentColor: "#1E3DFF",
          logo: "/logo.svg",
        },
        // Configure supported wallet types
        loginMethods: ["wallet", "email"],
        // Configure supported chains
        supportedChains: supportedChains,
        // Set default chain
        defaultChain: supportedChains[0],
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PrivyProvider>
  );
}
