"use client";

import React from "react";
import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  const { open } = useAppKit();

  return (
    <button
      onClick={() => open()}
      className="rounded-xl px-3 py-3 font-bold text-sm bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white border-2 border-white shadow-lg hover:scale-105 focus:outline-none transition-transform duration-200"
    >
      Connect Wallet
    </button>
  );
}
