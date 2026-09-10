const token = process.env.TELEGRAM_BOT_TOKEN;
const siteUrl = process.env.SITE_URL;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token || !siteUrl || !secret) {
  throw new Error("Set TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET and SITE_URL before running this script.");
}

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: `${siteUrl.replace(/\/$/, "")}/api/telegram`,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  }),
});

const result = await response.json();
if (!response.ok || !result.ok) {
  throw new Error(`Telegram webhook setup failed with status ${response.status}.`);
}

console.log("Telegram webhook configured successfully.");
