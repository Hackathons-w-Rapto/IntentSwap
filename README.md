# 🤖 IntentSwap - AI-Powered Token Transfer Agent

An intelligent blockchain transaction assistant that enables users to execute token transfers and check balances through natural language commands on the Somnia testnet.

## ✨ Features

### 🎯 Natural Language Processing
- **AI-Powered Intent Parsing**: Uses Google's Gemini AI to understand user commands
- **Multiple Command Formats**: Supports various natural language patterns
- **Context-Aware Responses**: Maintains conversation history for better understanding

### 💸 Transaction Management
- **Smart Transfer Execution**: Securely execute token transfers via MetaMask
- **Balance Checking**: Query token balances with simple commands
- **Gas Estimation**: Automatic gas fee calculation before execution
- **Real-Time Status Tracking**: Monitor transaction confirmations

### 🔒 Security
- **MetaMask Integration**: All transactions signed client-side
- **User Confirmation Required**: Explicit approval for all transfers
- **Address Validation**: Ensures valid recipient addresses
- **No Private Key Storage**: Keys never leave user's wallet

## 🎮 Example Commands

### Balance Checks
```
"Check my balance"
"What's my STT balance?"
"Show me my tokens"
```

### Token Transfers
```
"Send 50 STT to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
"Transfer 100 tokens to alice.eth"
"Pay Bob 25 STT"
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **AI/NLP**: Google Gemini AI (`gemini-robotics-er-1.5-preview`)
- **Blockchain**: Ethers.js v6
- **Wallets**: Wagmi + WalletConnect/MetaMask
- **Network**: Somnia Testnet

### Core Components

#### Backend Services
- **Chat API** (`/api/chat`): Main conversation endpoint with intent parsing
- **Balance API** (`/api/balance`): Token balance queries
- **Transaction Status** (`/api/transaction-status`): Track transaction confirmations
- **Intent Parser** (`/api/parse-intent`): Standalone intent extraction

#### AI Agent
- **GeminiParser**: Extracts structured intents from natural language
- **Response Generation**: Context-aware conversational responses
- **Confidence Scoring**: Validates intent confidence (>70%)

#### Blockchain Client
- **Balance Queries**: Native and ERC20 token balances
- **Gas Estimation**: Pre-transaction gas calculations
- **Address Resolution**: ENS-like name resolution
- **Transaction Tracking**: Status monitoring and confirmations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask wallet
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Required: Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Somnia Testnet Configuration
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_STT_TOKEN_ADDRESS=0x7f89af8b3c0A68F536Ff20433927F4573CF001A3
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Setup MetaMask for Somnia Testnet

1. Open MetaMask
2. Add Custom Network:
   - **Network Name**: Somnia Testnet
   - **RPC URL**: https://dream-rpc.somnia.network
   - **Chain ID**: 50311
   - **Currency Symbol**: STT
   - **Block Explorer**: https://explorer.somnia.network

3. Get testnet tokens from Somnia faucet

## 📖 How It Works

### Transaction Flow

1. **User Input**: User types a natural language command
   ```
   "Send 50 STT to Alice"
   ```

2. **AI Processing**: Gemini AI parses the intent
   ```json
   {
     "action": "transfer",
     "amount": "50",
     "token": "STT",
     "recipient": "Alice",
     "confidence": 0.95
   }
   ```

3. **Validation & Preparation**
   - Resolves recipient address
   - Estimates gas fees
   - Fetches current balance

4. **User Confirmation**
   - Displays transaction details
   - Shows balance and gas estimate
   - Requires explicit approval

5. **Execution**
   - Triggers MetaMask popup
   - User signs transaction
   - Broadcasts to blockchain

6. **Status Tracking**
   - Monitors transaction status
   - Shows confirmations
   - Updates UI on completion

## 🛠️ Development

### Project Structure
```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Main chat endpoint
│   │   ├── balance/      # Balance queries
│   │   ├── parse-intent/ # Intent parsing
│   │   └── transaction-status/
│   └── chat/             # Chat interface
├── lib/
│   ├── ai/               # Gemini AI integration
│   │   └── gemini.ts
│   ├── blockchain/       # Blockchain utilities
│   │   ├── client.ts     # Blockchain client
│   │   └── config.ts     # Network config
│   └── types.ts          # TypeScript types
├── components/           # React components
└── hooks/               # Custom hooks
```

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## 📚 Documentation

For detailed documentation, see [TRANSACTION_AGENT.md](./TRANSACTION_AGENT.md):
- Complete API reference
- Architecture deep-dive
- Security considerations
- Adding new features
- Troubleshooting guide

## 🔐 Security Considerations

- ✅ Private keys never stored or transmitted
- ✅ All transactions signed client-side via MetaMask
- ✅ User confirmation required for all transfers
- ✅ Address validation before execution
- ✅ Gas estimation to prevent unexpected fees
- ✅ API keys secured server-side only

## 🐛 Troubleshooting

### Transaction Not Executing
- Ensure MetaMask is unlocked
- Verify you're on Somnia Testnet (Chain ID: 50311)
- Check sufficient token balance
- Ensure enough native tokens for gas

### AI Not Understanding
- Use clear, simple language
- Include amount, token, and recipient
- Try suggested command formats

### Balance Not Showing
- Verify wallet connection
- Check correct network selected
- Ensure token address is correct

## 🎯 Future Enhancements

- [ ] Multi-chain support (Ethereum, Polygon, etc.)
- [ ] Token swap integration
- [ ] Address book for saved contacts
- [ ] Transaction history in chat
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Batch transfers
- [ ] Scheduled transfers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for Somnia Hackathon
- Powered by Google Gemini AI
- Uses Ethers.js for blockchain interactions
- UI components from shadcn/ui

---

**Track**: DeFi Agents  
**Description**: Simplifying blockchain interactions through conversational AI, making token transfers accessible to everyone.

Built with ❤️ using Next.js, Gemini AI, and Ethers.js
