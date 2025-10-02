export const SOMNIA_CONFIG = {
    chainId: 50311,
    chainName: "Somnia Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || "https://dream-rpc.somnia.network",
    blockExplorer: "https://explorer.somnia.network",
    nativeCurrency: {
      name: "STT",
      symbol: "STT",
      decimals: 18,
    },
  };
  
  export const TOKEN_ADDRESSES = {
    STT: process.env.NEXT_PUBLIC_STT_TOKEN_ADDRESS || "0x...",
  };
  
  // ERC20 ABI for token transfers
  export const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
  ];