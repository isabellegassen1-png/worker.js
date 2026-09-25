import { Bot, InlineKeyboard } from "gramio";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

const bot = new Bot(process.env.BOT_TOKEN);

// 1. REGISTER BOT COMMAND MENU
bot.onStart(async () => {
  await bot.api.setMyCommands({
    commands: [
      { command: "start", description: "Launch AI Asset Labs" },
      { command: "enter", description: "Enter Lab and Claim Access" },
      { command: "gram", description: "Check GRAM Status LIVE" },
      { command: "vip", description: "VIP Access Pass via Crypto" },
      { command: "referral", description: "Invite Friend for Extra Days" },
      { command: "concierge", description: "Direct Support" },
    ],
  });
  console.log("Bot commands successfully registered!");
});

// 2. VIP CRYPTO PAYMENT HANDLER
const sendVipPayment = async (ctx) => {
  // Pulled dynamically from Render Environment Variables
  const btcWallet = process.env.BTC_WALLET_ADDRESS || "Contact Concierge for BTC Address";
  const zecWallet = process.env.ZEC_WALLET_ADDRESS || "Contact Concierge for ZEC Address";
  const usdcPolygonWallet = process.env.USDC_POLYGON_ADDRESS || "Contact Concierge for USDC Polygon Address";
  const gramWallet = process.env.GRAM_WALLET_ADDRESS || "Contact Concierge for GRAM/TON Address";

  const paymentKeys = new InlineKeyboard()
    .url("Pay via $GRAM / TON", "https://ton.app")
    .row()
    .url("Direct Concierge", "https://t.me/IsabelleGassen");

  await ctx.send(
    `💎 **AI_Asset_Labs VIP Access Pass**\n\n` +
    `• 5x Daily Market Signals\n` +
    `• Ready-to-Post X Copy & Visual Drops\n` +
    `• Sovereign Settlement Alpha\n\n` +
    `**1. Bitcoin (BTC Mainnet):**\n\`${btcWallet}\`\n\n` +
    `**2. Zcash (ZEC - Private Settlement):**\n\`${zecWallet}\`\n\n` +
    `**3. USDC (Polygon Network):**\n\`${usdcPolygonWallet}\`\n\n` +
    `**4. TON / $GRAM Wallet:**\n\`${gramWallet}\`\n\n` +
    `*Need to settle in another Altcoin (ETH, SOL, XMR)? Contact Concierge.*`,
    { reply_markup: paymentKeys }
  );
};

// COMMAND HANDLERS
bot.command("start", (ctx) => ctx.send("Welcome to AI Asset Labs! Use /vip to view payment options."));
bot.command("enter", (ctx) => ctx.send("Claiming access... Check /vip for membership key."));
bot.command("gram", (ctx) => ctx.send("Checking $GRAM live status... System operational."));
bot.command("vip", sendVipPayment);
bot.hears("💎 VIP Pass Access", sendVipPayment);
bot.command("referral", (ctx) => ctx.send("Share your link to earn +7 days VIP access."));
bot.command("concierge", (ctx) => ctx.send("Contact Concierge directly: https://t.me/IsabelleGassen"));

// HEALTH CHECK ENDPOINT FOR RENDER
app.get("/", (req, res) => res.send("AI Asset Labs Engine Active"));
app.listen(port, () => console.log(`Server listening on port ${port}`));

bot.start();
