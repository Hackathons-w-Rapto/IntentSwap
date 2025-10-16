export interface ParsedIntent {
    action: "transfer" | "send" | "pay" | "balance" | "check" | "balance_check" | null;
    amount: string | null;
    token: string;
    recipient: string | null;
    confidence: number;
  }
  
  export interface TransactionRequest {
    from: string;
    to: string;
    amount: string;
    tokenAddress: string;
  }
  
  export interface TransactionResult {
    success: boolean;
    txHash?: string;
    error?: string;
    gasUsed?: string;
  }
  
  export interface ENSResolution {
    address: string | null;
    name: string;
}
  