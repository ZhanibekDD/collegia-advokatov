import { isTelegramAdmin, secureEqual } from "../../lib/admin-auth";
import {
  createAdvocate,
  createNews,
  getContentStats,
  listAdminAdvocates,
  listAdminNews,
  parseContactsInput,
  updateAdvocate,
  updateNews,
  type AdvocateUpdate,
} from "../../lib/content-service";

export const dynamic = "force-dynamic";

type TelegramUser = { id: number; first_name?: string; username?: string };
type TelegramMessage = { message_id: number; chat: { id: number }; from?: TelegramUser; text?: string };
type TelegramCallback = { id: string; from: TelegramUser; message?: TelegramMessage; data?: string };
type TelegramUpdate = { update_id: number; message?: TelegramMessage; callback_query?: TelegramCallback };

const keyboard = {
  keyboard: [[{ text: "/stats" }, { text: "/news_list" }], [{ text: "/help" }]],
  resize_keyboard: true,
};

const helpText = `Управление KAOJ.KZ

Адвокаты:
/find ФИО — найти запись
/advocate_add ФИО | Подразделение | Телефон | да/нет ГГЮП | № ГГЮП | Регион
/advocate_update ID | поле | значение
/advocate_delete ID — скрыть прекратившего деятельность
/advocate_restore ID — восстановить

Поля обновления: name, region, consultation, contacts, ggup, ggupsource, active.

Новости и мероприятия:
/news_publish Заголовок RU | Анонс RU | Текст RU | YYYY-MM-DD | news/event | Заголовок KZ | Анонс KZ | Текст KZ
/news_draft — тот же формат, но без публикации
/news_update ID | поле | значение
/news_delete ID — отправить в архив
/news_list — последние публикации

Поля публикации: title, titlekk, excerpt, excerptkk, content, contentkk, date, kind, status.`;

function splitParts(value: string): string[] {
  return value.split("|").map((part) => part.trim());
}

function truthy(value: string): boolean {
  return ["1", "да", "yes", "true", "on", "active", "published"].includes(value.trim().toLocaleLowerCase("ru-RU"));
}

async function telegramCall(token: string, method: string, payload: object): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    console.error(JSON.stringify({ message: "telegram_api_error", method, status: response.status }));
  }
}

async function sendMessage(token: string, chatId: number, text: string): Promise<void> {
  await telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text: text.slice(0, 4000),
    reply_markup: keyboard,
  });
}

async function processCommand(text: string, actorId: string): Promise<string> {
  const [head, ...tail] = text.trim().split(/\s+/);
  const command = (head || "/help").split("@")[0].toLocaleLowerCase("en-US");
  const argument = text.trim().slice(head?.length ?? 0).trim();
  const actor = { type: "telegram" as const, id: actorId };

  if (command === "/start" || command === "/help") return helpText;

  if (command === "/stats") {
    const stats = await getContentStats();
    return `Состояние сайта\nАдвокатов: ${stats.advocates}\nОпубликовано новостей: ${stats.publishedNews}\nЧерновиков: ${stats.drafts}`;
  }

  if (command === "/find") {
    const query = tail.join(" ").toLocaleLowerCase("ru-RU");
    if (!query) return "После /find укажите фамилию или часть ФИО.";
    const matches = (await listAdminAdvocates()).filter((item) => item.name.toLocaleLowerCase("ru-RU").includes(query)).slice(0, 12);
    return matches.length
      ? matches.map((item) => `${item.active ? "●" : "○"} ${item.id}\n${item.name}\n${item.consultation}`).join("\n\n")
      : "Совпадений не найдено.";
  }

  if (command === "/advocate_add") {
    const [name, consultation, contacts, ggup, ggupSourceId, region] = splitParts(argument);
    if (!name || !consultation || !contacts) return "Формат: /advocate_add ФИО | Подразделение | Телефон | да/нет ГГЮП | № ГГЮП | Регион";
    const created = await createAdvocate({
      name,
      consultation,
      contacts: parseContactsInput(contacts),
      ggup2026: truthy(ggup ?? "нет"),
      ggupSourceId: /^\d+$/.test(ggupSourceId ?? "") ? Number(ggupSourceId) : null,
      region: region || "область Жетісу",
    }, actor);
    return `Добавлено: ${created.name}\nID: ${created.id}`;
  }

  if (command === "/advocate_update") {
    const [id, field, value] = splitParts(argument);
    if (!id || !field) return "Формат: /advocate_update ID | поле | значение";
    const update: AdvocateUpdate = {};
    const normalizedField = field.toLocaleLowerCase("en-US");
    if (normalizedField === "name") update.name = value ?? "";
    else if (normalizedField === "region") update.region = value ?? "";
    else if (normalizedField === "consultation") update.consultation = value ?? "";
    else if (normalizedField === "contacts") update.contacts = parseContactsInput(value ?? "");
    else if (normalizedField === "ggup") update.ggup2026 = truthy(value ?? "");
    else if (normalizedField === "ggupsource") update.ggupSourceId = /^\d+$/.test(value ?? "") ? Number(value) : null;
    else if (normalizedField === "active") update.active = truthy(value ?? "");
    else return "Неизвестное поле. Доступно: name, region, consultation, contacts, ggup, ggupsource, active.";
    const updated = await updateAdvocate(id, update, actor);
    return `Обновлено: ${updated.name}`;
  }

  if (command === "/advocate_delete" || command === "/advocate_restore") {
    const id = argument.trim();
    if (!id) return `Формат: ${command} ID`;
    const active = command === "/advocate_restore";
    const updated = await updateAdvocate(id, { active }, actor);
    return active ? `Восстановлено: ${updated.name}` : `Скрыто с сайта: ${updated.name}`;
  }

  if (command === "/news_publish" || command === "/news_draft") {
    const [titleRu, excerptRu, contentRu, eventDate, kind, titleKk, excerptKk, contentKk] = splitParts(argument);
    if (!titleRu) return `Формат: ${command} Заголовок RU | Анонс RU | Текст RU | YYYY-MM-DD | news/event | Заголовок KZ | Анонс KZ | Текст KZ`;
    const post = await createNews({
      titleRu,
      titleKk,
      excerptRu,
      excerptKk,
      contentRu,
      contentKk,
      eventDate: eventDate || null,
      kind: kind === "event" ? "event" : "news",
      status: command === "/news_publish" ? "published" : "draft",
    }, actor);
    return `${post.status === "published" ? "Опубликовано" : "Черновик сохранён"}: ${post.titleRu}\nID: ${post.id}`;
  }

  if (command === "/news_update") {
    const [id, field, value] = splitParts(argument);
    if (!id || !field) return "Формат: /news_update ID | поле | значение";
    const normalizedField = field.toLocaleLowerCase("en-US");
    const input: Parameters<typeof updateNews>[1] = {};
    if (normalizedField === "title") input.titleRu = value ?? "";
    else if (normalizedField === "titlekk") input.titleKk = value ?? "";
    else if (normalizedField === "excerpt") input.excerptRu = value ?? "";
    else if (normalizedField === "excerptkk") input.excerptKk = value ?? "";
    else if (normalizedField === "content") input.contentRu = value ?? "";
    else if (normalizedField === "contentkk") input.contentKk = value ?? "";
    else if (normalizedField === "date") input.eventDate = value || null;
    else if (normalizedField === "kind") input.kind = value === "event" ? "event" : "news";
    else if (normalizedField === "status") input.status = value === "published" ? "published" : value === "archived" ? "archived" : "draft";
    else return "Неизвестное поле. Доступно: title, titlekk, excerpt, excerptkk, content, contentkk, date, kind, status.";
    const post = await updateNews(id, input, actor);
    return `Публикация обновлена: ${post.titleRu}`;
  }

  if (command === "/news_delete") {
    const id = argument.trim();
    if (!id) return "Формат: /news_delete ID";
    const post = await updateNews(id, { status: "archived" }, actor);
    return `Перенесено в архив: ${post.titleRu}`;
  }

  if (command === "/news_list") {
    const posts = (await listAdminNews()).slice(0, 12);
    return posts.length
      ? posts.map((post) => `${post.status === "published" ? "●" : post.status === "draft" ? "◐" : "○"} ${post.titleRu}\n${post.id}`).join("\n\n")
      : "Публикаций пока нет.";
  }

  return `Команда не распознана.\n\n${helpText}`;
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN ?? "";
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";
  if (!token || !expectedSecret) return Response.json({ error: "Telegram не настроен" }, { status: 503 });

  const suppliedSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
  if (!(await secureEqual(suppliedSecret, expectedSecret))) {
    return Response.json({ error: "Недействительный webhook" }, { status: 401 });
  }

  try {
    const update: TelegramUpdate = await request.json();
    const message = update.message ?? update.callback_query?.message;
    const sender = update.message?.from ?? update.callback_query?.from;
    if (!message || !sender) return Response.json({ ok: true });

    if (!isTelegramAdmin(sender.id)) {
      await sendMessage(token, message.chat.id, "У этого Telegram-аккаунта нет доступа к управлению сайтом.");
      return Response.json({ ok: true });
    }

    const commandText = update.callback_query?.data ?? message.text ?? "/help";
    const reply = await processCommand(commandText, String(sender.id));
    if (update.callback_query) {
      await telegramCall(token, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
    }
    await sendMessage(token, message.chat.id, reply);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ message: "telegram_webhook_error", error: error instanceof Error ? error.message : String(error) }));
    return Response.json({ ok: true });
  }
}
