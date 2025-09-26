// import { useAccount } from "wagmi";
// import { useAppKit } from "@reown/appkit/react";

// export default function ConnectButton() {
//   const { open } = useAppKit();
//   const { address, isConnected } = useAccount();

//   if (isConnected) {
//     return (
//       <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-white bg-black/60 text-white">
//         {/* You can add a chain logo here if available */}
//         <span className="font-mono text-xs">
//           {address.slice(0, 6)}...{address.slice(-4)}
//         </span>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={() => open()}
//       className="rounded-xl px-3 py-3 font-bold text-sm bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white border-2 border-white shadow-lg hover:scale-105 focus:outline-none transition-transform duration-200"
//     >
//       Connect Wallet
//     </button>
//   );
// }

export default function ConnectButton() {
  return (
    <appkit-button className="rounded-xl px-3 py-3 font-bold text-sm bg-gradient-to-r from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white border-2 border-white shadow-lg hover:scale-105 focus:outline-none transition-transform duration-200" />
  );
}
