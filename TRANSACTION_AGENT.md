# Chat Transaction Agent Documentation

## Overview
The Chat Transaction Agent is an AI-powered blockchain transaction assistant that allows users to execute token transfers and check balances through natural language commands. It integrates with MetaMask to securely execute transactions on the Somnia testnet.

## Features

### 1. Natural Language Processing
- Uses Google's Gemini AI to parse user intents from natural language
- Understands various command formats:
  - "Send 50 STT to Alice"
  - "Transfer 100 tokens to 0x123..."
  - "Pay Bob 25 STT"
  - "Check my balance"
  - "What's my STT balance?"

### 2. Transaction Flow
1. **Intent Parsing**: AI parses user message to extract:
   - Action type (transfer, send, pay, balance check)
   - Amount (for transfers)
   - Token symbol (defaults to STT)
   - Recipient address or name

2. **Validation & Preparation**:
   - Validates token support
   - Resolves recipient addresses (ENS-like functionality)
   - Estimates gas fees
   - Fetches user balance for confirmation

3. **User Confirmation**:
   - Displays transaction details
   - Shows current balance
   - Shows estimated gas fees
   - Requires explicit confirmation

4. **Execution**:
   - Triggers MetaMask popup for signature
   - Submits transaction to blockchain
   - Tracks transaction status
   - Provides real-time updates

### 3. Balance Checking
- Query balance with natural language
- Supports multiple tokens (currently STT)
- Real-time balance updates

## Architecture

### Backend Components

#### 1. API Routes

**`/api/chat`** - Main chat endpoint
- Accepts: `{ message, context, senderAddress }`
- Returns: `{ success, response, data, intent }`
- Handles:
  - Intent parsing
  - Address resolution
  - Gas estimation
  - Balance checks
  - Response generation

**`/api/balance`** - Balance query endpoint
- Accepts: `{ address, token }`
- Returns: `{ success, data: { balance, token } }`

**`/api/transaction-status`** - Transaction tracking
- Accepts: `{ txHash }`
- Returns: `{ success, status, confirmations }`

**`/api/parse-intent`** - Intent parsing (standalone)
- Accepts: `{ message }`
- Returns: `{ success, intent }`

#### 2. AI Agent (`src/lib/ai/gemini.ts`)

**GeminiParser Class**:
- `parseIntent(message)`: Extracts structured intent from text
  - Returns: `{ action, amount, token, recipient, confidence }`
  - Supports both transactions and balance checks
  - Validates confidence threshold (>0.7)

- `generateResponse(context, message, address)`: Generates conversational responses
  - Context-aware
  - Friendly and helpful
  - Clear error messages

#### 3. Blockchain Client (`src/lib/blockchain/client.ts`)

**BlockchainClient Class**:
- `getBalance(address, tokenAddress?)`: Query token/native balance
- `estimateGas(from, to, amount, tokenAddress)`: Calculate gas fees
- `getTransactionStatus(txHash)`: Track transaction status
- `resolveAddress(nameOrAddress)`: Resolve ENS-like names

### Frontend Components

#### Chat Interface (`src/app/chat/page.tsx`)

**Key Functions**:
- `sendMessage()`: Handles user input
  - Calls `/api/chat` with message and context
  - Shows appropriate UI based on response type
  - Triggers balance fetch for transactions

- `confirmTransaction()`: Executes approved transaction
  - Calls `sendRealTransaction()` to trigger MetaMask
  - Polls for transaction status
  - Updates UI with confirmation/failure

- `sendRealTransaction()`: MetaMask integration
  - Creates ethers.js provider from window.ethereum
  - Gets signer from user wallet
  - Creates ERC20 contract instance
  - Calls `transfer()` method (triggers MetaMask popup)
  - Returns transaction hash

**UI States**:
- Normal message
- Typing indicator
- Confirmation panel (shows transaction details)
- Transaction in progress
- Transaction confirmed/failed

## Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Required: Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Somnia Testnet Configuration
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_STT_TOKEN_ADDRESS=0x7f89af8b3c0A68F536Ff20433927F4573CF001A3
```

### Supported Tokens
Currently configured in `src/lib/blockchain/config.ts`:
- STT (Somnia Testnet Token)

To add more tokens, update `TOKEN_ADDRESSES` object.

### Network Configuration
- Chain ID: 50311
- Network: Somnia Testnet
- RPC URL: https://dream-rpc.somnia.network
- Explorer: https://explorer.somnia.network

## Usage Examples

### Balance Check
```
User: "Check my balance"
Agent: "Your current STT balance is 1000."

User: "What's my STT balance?"
Agent: "Your current STT balance is 1000."
```

### Token Transfer
```
User: "Send 50 STT to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
Agent: "You're sending 50 STT to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb.
       Estimated gas: 0.001 STT.
       Would you like me to prepare the transaction?"
       
       [Shows confirmation panel with transaction details]
       
User: [Clicks "Confirm & Send"]
       [MetaMask popup appears for signature]
       
Agent: "Transaction submitted!
       Your transfer is being processed on Somnia testnet."
       
       [After confirmation]
       
Agent: "Transaction confirmed!
       Successfully transferred 50 STT to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

## Error Handling

### Common Errors
1. **Wallet Not Connected**: Prompts user to connect wallet
2. **Insufficient Balance**: Shows balance and requested amount
3. **Invalid Address**: Validates recipient address format
4. **Unsupported Token**: Lists supported tokens
5. **Transaction Failed**: Shows error from MetaMask/blockchain
6. **Network Error**: Suggests checking connection

### Error Messages
- Clear and user-friendly
- Actionable suggestions
- Context-aware

## Development

### Running Locally
```bash
# Install dependencies
npm install

# Create .env.local with required keys
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

### Testing the Agent
1. Connect wallet (MetaMask)
2. Ensure you're on Somnia Testnet
3. Try balance check: "Check my balance"
4. Try transfer: "Send 1 STT to [address]"
5. Confirm transaction in MetaMask

### Adding New Features

#### Add New Token Support
1. Update `TOKEN_ADDRESSES` in `src/lib/blockchain/config.ts`
2. Add token to `.env.local` if needed
3. Update AI prompts to recognize new token

#### Add New Intent Types
1. Update `ParsedIntent` interface in `src/lib/types.ts`
2. Update AI prompts in `src/lib/ai/gemini.ts`
3. Add handler in `/api/chat` route
4. Update frontend to handle new intent type

## Security Considerations

1. **Private Keys**: Never stored or transmitted
   - All signing done client-side via MetaMask
   - Backend never has access to private keys

2. **User Confirmation**: Required for all transactions
   - Shows full transaction details
   - User must explicitly approve

3. **Gas Estimation**: Calculated before execution
   - Prevents unexpected gas fees
   - Shows estimates to user

4. **Address Validation**: All addresses validated
   - Checks format using ethers.js
   - Prevents sending to invalid addresses

5. **API Key Security**: Gemini API key server-side only
   - Never exposed to client
   - Used only in API routes

## Troubleshooting

### Transaction Not Executing
- Ensure MetaMask is unlocked
- Check network (should be Somnia Testnet)
- Verify sufficient token balance
- Check sufficient native token for gas

### AI Not Understanding Commands
- Use clear, simple language
- Include amount, token, and recipient
- Try example formats from suggestions

### Balance Not Updating
- Wait for transaction confirmation
- Check transaction status on explorer
- Ensure correct token address

## Future Enhancements

1. **Multi-Chain Support**: Add support for other networks
2. **Swap Integration**: Enable token swaps via chat
3. **Address Book**: Save frequently used addresses with names
4. **Transaction History**: Show past transactions in chat
5. **Voice Input**: Voice-to-text for commands
6. **Multi-Language**: Support multiple languages
7. **Advanced Intents**: Batch transfers, scheduled transfers, etc.

## API Reference

### Chat API Response Format
```typescript
{
  success: boolean;
  message: string;
  response: string;  // AI text response
  data?: {           // Transaction data (if applicable)
    amount: string;
    token: string;
    recipient: string;
    gasEstimate: string;
  };
  intent?: {         // Parsed intent
    action: string;
    amount: string | null;
    token: string;
    recipient: string | null;
    confidence: number;
  };
}
```

### Transaction Confirmation Flow
```typescript
// 1. User sends message
await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: "Send 50 STT to Alice",
    context: [...previousMessages],
    senderAddress: userWalletAddress
  })
});

// 2. If transaction intent, show confirmation
// 3. User confirms

// 4. Execute transaction
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
const tx = await contract.transfer(recipient, amount); // Triggers MetaMask

// 5. Track status
await fetch('/api/transaction-status', {
  method: 'POST',
  body: JSON.stringify({ txHash: tx.hash })
});
```

## Support

For issues or questions:
1. Check this documentation
2. Review example commands
3. Check browser console for errors
4. Verify MetaMask configuration
5. Check network and token addresses

---

Built with ❤️ using Next.js, Gemini AI, and ethers.js
