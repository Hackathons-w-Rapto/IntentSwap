🤖 Text-to-Transfer AI Agent
Core Features

Natural Language Processing → Parse text commands for token transfers
Smart Contract Integration → Execute transfers on Somnia testnet
Conversation Interface → Chat-like UI for easy interaction
Transaction Confirmation → Safety checks before execution

Example Commands
"Send 50 STT to 0x742d35Cc6238A4C8dF8A4bE89c8b9a2C4d5F6E7F"
"Transfer 100 tokens to alice.eth" 
"Pay 25 STT to Bob's wallet"
"Send my friend 10 tokens"
🛠 Tech Stack Suggestion

Frontend: React/Next.js with chat interface
AI/NLP:

Local: Use regex patterns + keyword matching
Or integrate OpenAI API for better understanding


Blockchain: Web3.js/Ethers.js for Somnia testnet
Smart Contract: ERC-20 token transfer logic

🏗 Architecture Flow

User types command in chat
AI parses: amount, recipient, token type
Display confirmation with parsed details
User approves → Execute transaction
Show transaction hash and status

🎯 Track Recommendation
DeFi Agents - This simplifies DeFi interactions through conversational AI, making token transfers more accessible.
🚀 MVP Features

Basic text parsing for transfers
Somnia testnet integration
Simple web interface
Transaction history

our tech stack: Frontend: Next.js, React, TailwindCSS
Backend: Next.js /api  
AI: Gemini API for natural language processing
Blockchain: Web3.js/Ethers.js + Somnia testnet
Wallets: MetaMask or WalletConnect for Somnia
Smart Contracts: Solidity contracts deployed on Somnia