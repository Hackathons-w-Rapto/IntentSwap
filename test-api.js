const { ethers } = require('ethers');

// Test the balance API endpoint
async function testBalanceAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: '0x1234567890123456789012345678901234567890', 
        token: 'STT' 
      })
    });
    
    const data = await response.json();
    console.log('Balance API response:', data);
    
  } catch (error) {
    console.error('Error testing balance API:', error.message);
  }
}

// Test the chat API endpoint
async function testChatAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'check my balance',
        context: [],
        senderAddress: '0x1234567890123456789012345678901234567890'
      })
    });
    
    const data = await response.json();
    console.log('Chat API response:', data);
    
  } catch (error) {
    console.error('Error testing chat API:', error.message);
  }
}

async function runTests() {
  console.log('Testing Balance API...');
  await testBalanceAPI();
  
  console.log('\nTesting Chat API...');
  await testChatAPI();
}

runTests();