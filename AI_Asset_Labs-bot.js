const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cron = require('node-cron');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("FATAL: TELEGRAM_BOT_TOKEN is not set.");
  process.exit(1);
}

// Telegram Bot instance
const bot = new TelegramBot(token, { polling: true });

// Live Settlement Wallets
const WALLETS = {
  btc: process.env.BTC_WALLET_ADDRESS || 'bc1q6zzppyptap0e09v5k7wss8kelqa5q8ftns5hhw6drr9y4enlcd9ss0cl7k',
  zec: process.env.ZEC_WALLET_ADDRESS || 't3hTFwWjNs5pDCVZ7ev5GxkQxq2PCC7USXU',
  usdc: process.env.USDC_POLYGON_ADDRESS || '0x24ae6a1aaadd3304fa038e1e42bb150a2b41c11e',
  gram: process.env.GRAM_WALLET_ADDRESS || 'UQDbzKWV-4KAUNC-K72G93rADOYr_Zssa_Lo75H5w8M5N2FY',
  sol: process.env.SOLANA_WALLET_ADDRESS || 'A31kTXMcQt1LHhRYZDSiv5pd8by5NUUpqsRZfNbqH3Yy',
  eth: process.env.ETH_WALLET_ADDRESS || '0x24ae6a1aaadd3304fa038e1e42bb150a2b41c11e'
}; 

// --- Telegram Commands (Human Buyers) ---

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to AI Asset Labs. Access private liquidity intelligence via /vip.");
});

bot.onText(/\/vip/, (msg) => {
  const vipMessage = 
`💎 *AI Asset Labs VIP Access Pass*

• 5x Daily Market Signals
• Turnkey X Copy & Visual Pipelines
• Sovereign Settlement Alpha

*Tap any address below to copy:*

*1. Bitcoin (BTC Mainnet):*
\`${WALLETS.btc}\`

*2. Zcash (ZEC Private Settlement):*
\`${WALLETS.zec}\`

*3. USDC (Polygon Network):*
\`${WALLETS.usdc}\`

*4. TON / $GRAM:*
\`${WALLETS.gram}\`

*5. Solana (SOL):*
\`${WALLETS.sol}\`

*6. Ethereum (ETH ERC20):*
\`${WALLETS.eth}\`

_Need alternative settlement (XMR)? Contact Concierge._`;

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "💎 Pay via TON / $GRAM", url: "https://ton.app" }],
        [{ text: "🏛️ Direct Concierge", url: "https://t.me/IsabelleGassen" }]
      ]
    },
    parse_mode: 'Markdown'
  };

  bot.sendMessage(msg.chat.id, vipMessage, inlineKeyboard);
});

bot.onText(/\/gram/, (msg) => {
  bot.sendMessage(msg.chat.id, `TON / $GRAM Address:\n\`${WALLETS.gram}\``, { parse_mode: 'Markdown' });
});

bot.onText(/\/referral/, (msg) => {
  bot.sendMessage(msg.chat.id, "Share your private link to claim +7 days VIP access.");
});

bot.onText(/\/concierge/, (msg) => {
  bot.sendMessage(msg.chat.id, "Direct Concierge Access:\nhttps://t.me/IsabelleGassen");
});

// --- Automated 3x Daily Content (You.com API) ---

const YOU_API_KEY = process.env.YOU_API_KEY;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

async function runAutonomousDrop() {
  if (!YOU_API_KEY || !ADMIN_CHAT_ID) return;

  try {
    const response = await axios.post(
      'https://api.you.com/v1/chat/completions',
      {
        model: 'better-search',
        messages: [
          {
            role: 'system',
            content: 'You are quantitative lead for AI Asset Labs. Deliver 1 concise, sophisticated market post with hook, alpha stat, hashtags, and a photorealistic visual prompt.'
          },
          {
            role: 'user',
            content: 'Scan breaking institutional crypto liquidity, BTC, and privacy movements and write today\'s drop.'
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${YOU_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const dropContent = response.data.choices[0].message.content;
    await bot.sendMessage(ADMIN_CHAT_ID, `📡 *Autonomous Alpha Generated:*\n\n${dropContent}`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error("You.com execution error:", err.response?.data || err.message);
  }
}

// Scheduled at 08:00, 14:00, 20:00 UTC
cron.schedule('0 8,14,20 * * *', () => {
  runAutonomousDrop();
});

// --- Express Engine & Machine Endpoint (AI Agent Buyers) ---

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AI Asset Labs Sovereign Engine Active');
});

// M2M Autonomous Agent Checkout Endpoint
app.get('/api/vip-checkout', (req, res) => {
  res.json({
    protocol: "aiassetlabs-agent-settlement-v1",
    tier: "VIP_ACCESS_PASS",
    description: "5x Daily Market Signals & Alpha Pipeline",
    accepted_currencies: {
      USDC_POLYGON: { network: "polygon", token_standard: "ERC20", address: WALLETS.usdc },
      SOLANA: { network: "solana", address: WALLETS.sol },
      BITCOIN: { network: "btc-mainnet", address: WALLETS.btc },
      ZCASH: { network: "zec-transparent", address: WALLETS.zec },
      TON_GRAM: { network: "ton", address: WALLETS.gram },
      ETHEREUM: { network: "ethereum", token_standard: "ERC20", address: WALLETS.eth }
    },
    concierge: "https://t.me/IsabelleGassen"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

