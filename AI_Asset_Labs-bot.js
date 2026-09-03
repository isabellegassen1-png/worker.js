export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Set webhook - visit /set once after deploy
    if (url.pathname === "/set") {
      const webhookUrl = `${url.origin}/webhook`;
      const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook?url=${webhookUrl}`);
      return new Response(`Webhook set to ${webhookUrl}: ${await res.text()}`);
    }

    // 2. Telegram sends messages here
    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        const update = await request.json();
        if (update.message) {
          const chatId = update.message.chat.id;
          const text = (update.message.text || "").toLowerCase();

          let reply = "Send /gift or /pricing 💖";
          if (text === "/start") reply = "🚀 Bot live! Isabelle, your bot is ready! Try /gift /pricing";
          if (text.includes("/gift")) reply = "🎁 Here is your gift! Link: YOUR_LINK";
          if (text.includes("/pricing")) reply = "💶 Pricing: DM me for private info";
          if (text.includes("hi") || text.includes("hello")) reply = "Hey love 😍 how can I help?";

          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: reply }),
          });
        }
      } catch (e) {}
      return new Response("OK");
    }

    return new Response("Bot running. Go to /set to connect Telegram.");
  },
};
