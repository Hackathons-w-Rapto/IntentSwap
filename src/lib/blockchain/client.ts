import { ethers } from "ethers";
import { SOMNIA_CONFIG, ERC20_ABI, TOKEN_ADDRESSES } from "./config";

export class BlockchainClient {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(SOMNIA_CONFIG.rpcUrl, undefined, { staticNetwork: true });
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
        // Get native balance (STT)
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
      if (!tokenAddress) {
        // Native token transfer (STT) - estimate gas for simple transfer
        const amountWei = ethers.parseEther(amount);
        const gasEstimate = await this.provider.estimateGas({
          from,
          to,
          value: amountWei,
        });

        const feeData = await this.provider.getFeeData();
        const pricePerGas = feeData.gasPrice ?? feeData.maxFeePerGas ?? BigInt(0);

        const totalCostWei = gasEstimate * pricePerGas;
        return ethers.formatEther(totalCostWei);
      } else {
        // ERC20 token transfer
        const contract = await this.getTokenContract(tokenAddress);
        const decimals = await contract.decimals();
        const amountWei = ethers.parseUnits(amount, decimals);

        // Create a contract instance with a signer for gas estimation
        // We need to create a temporary wallet for gas estimation
        const tempWallet = ethers.Wallet.createRandom().connect(this.provider);
        const contractWithSigner = contract.connect(tempWallet);

        // ethers v6: use contract.estimateGas.<fn> and include from override
        const gasEstimate: bigint = await contractWithSigner.estimateGas.transfer(
          to,
          amountWei,
          { from }
        );

        const feeData = await this.provider.getFeeData();
        const pricePerGas = feeData.gasPrice ?? feeData.maxFeePerGas ?? BigInt(0);

        const totalCostWei = gasEstimate * pricePerGas;
        return ethers.formatEther(totalCostWei);
      }
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

      // For now, we don't have name resolution implemented
      // Return null so the AI can ask for the actual address
      console.log(`Could not resolve address for: ${nameOrAddress}`);
      return null;
    } catch (error) {
      console.error("Error resolving address:", error);
      return null;
    }
  }
}