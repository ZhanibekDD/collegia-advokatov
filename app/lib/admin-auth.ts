import { getChatGPTUser, type ChatGPTUser } from "../chatgpt-auth";

function values(name: string): Set<string> {
  return new Set(
    (process.env[name] ?? "")
      .split(",")
      .map((value) => value.trim().toLocaleLowerCase("en-US"))
      .filter(Boolean),
  );
}

export function isAdminUser(user: ChatGPTUser): boolean {
  const ids = values("ADMIN_ACCOUNT_USER_IDS");
  const emails = values("ADMIN_EMAILS");
  return ids.has(user.userId.toLocaleLowerCase("en-US")) || emails.has(user.email.toLocaleLowerCase("en-US"));
}

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isAdminUser(user) ? user : null;
}

export async function adminApiAccess(): Promise<
  | { ok: true; user: ChatGPTUser }
  | { ok: false; response: Response }
> {
  const user = await getChatGPTUser();
  if (!user) {
    return { ok: false, response: Response.json({ error: "Требуется авторизация" }, { status: 401 }) };
  }
  if (!isAdminUser(user)) {
    return { ok: false, response: Response.json({ error: "Нет доступа к панели управления" }, { status: 403 }) };
  }
  return { ok: true, user };
}

export function isTelegramAdmin(userId: number): boolean {
  return values("TELEGRAM_ADMIN_IDS").has(String(userId));
}

export async function secureEqual(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}
