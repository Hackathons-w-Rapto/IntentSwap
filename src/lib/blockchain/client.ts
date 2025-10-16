import { ethers } from "ethers";
import { SOMNIA_CONFIG, ERC20_ABI } from "./config";

export class BlockchainClient {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(SOMNIA_CONFIG.rpcUrl);
  }

  async getProvider() {
    return this.provider;
  }

  async getTokenContract(tokenAddress: string) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
  }

  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    try {
      if (!tokenAddress) {
        // Get native balance
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      } else {
        // Get token balance
        const contract = await this.getTokenContract(tokenAddress);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        return ethers.formatUnits(balance, decimals);
      }
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async estimateGas(from: string, to: string, amount: string, tokenAddress: string): Promise<string> {
    try {
      const contract = await this.getTokenContract(tokenAddress);
      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);
      
      const gasEstimate = await contract.transfer.estimateGas(to, amountWei);
      const gasPrice = await this.provider.getFeeData();
      
      const totalGas = gasEstimate * (gasPrice.gasPrice || BigInt(0));
      return ethers.formatEther(totalGas);
    } catch (error) {
      console.error("Error estimating gas:", error);
      return "0.001"; // Default estimate
    }
  }

  async getTransactionStatus(txHash: string): Promise<{
    status: "pending" | "confirmed" | "failed";
    confirmations: number;
  }> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { status: "pending", confirmations: 0 };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        status: receipt.status === 1 ? "confirmed" : "failed",
        confirmations,
      };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return { status: "pending", confirmations: 0 };
    }
  }

  async resolveAddress(nameOrAddress: string): Promise<string | null> {
    try {
      // Check if it's already an address
      if (ethers.isAddress(nameOrAddress)) {
        return nameOrAddress;
      }

      // Try ENS resolution (if you have ENS on Somnia)
      // For now, return null if not a valid address
      // You can implement custom name resolution here
      
      return null;
    } catch (error) {
      console.error("Error resolving address:", error);
      return null;
    }
  }
}