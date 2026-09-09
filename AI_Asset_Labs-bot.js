
export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      try {
        const update = await request.json();
        if (update.message) {
          await handleMessage(update.message, env);
        }
      } catch (e) {
        console.log("Error:", e);
      }
      return new Response("OK", { status: 200 });
    }
    return new Response("AI Asset Labs Bot is running 🧪", { status: 200 });
  }
}

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = (message.text || "").trim();

  // /start command
  if (text === "/start") {
    const welcome = `🧪 *Welcome to AI ASSET LABS*\n\nYour personal AI Vault is ready.\n\nClick below to enter:`;
    await sendKeyboard(chatId, welcome, env);
    return;
  }

  // ENTER LAB button or /enter
  if (text.includes("ENTER LAB") || text === "/enter" || text === "/lab") {
    await sendMessage(chatId, "🧪 *LAB ACCESS GRANTED*\n\nWhat do you want to create today?\n\n1. Generate Assets\n2. Check GRAM LIVE\n3. Settings", env);
    return;
  }

  if (text.includes("GRAM LIVE")) {
    await sendMessage(chatId, "🔴 GRAM LIVE is coming online...\n\nStay tuned!", env);
    return;
  }

  // default echo
  await sendMessage(chatId, `Got it: ${text}\n\nType /start to open menu.`, env);
}

async function sendMessage(chatId, text, env) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    })
  });
}

async function sendKeyboard(chatId, text, env) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [
          [{ text: "ENTER LAB 🧪" }],
          [{ text: "GRAM LIVE 🔴" }, { text: "HELP ❓" }]
        ],
        resize_keyboard: true
      }
    })
  });
}
