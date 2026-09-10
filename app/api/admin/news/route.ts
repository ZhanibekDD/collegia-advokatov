import { adminApiAccess } from "../../../lib/admin-auth";
import { createNews, listAdminNews, updateNews, type NewsInput } from "../../../lib/content-service";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Не удалось выполнить операцию";
  return Response.json({ error: message }, { status: 400 });
}

function parseInput(value: unknown): NewsInput {
  if (!value || typeof value !== "object") throw new Error("Некорректные данные");
  const data = value as Record<string, unknown>;
  return {
    kind: data.kind === "event" ? "event" : "news",
    status: data.status === "published" ? "published" : "draft",
    titleRu: typeof data.titleRu === "string" ? data.titleRu : "",
    titleKk: typeof data.titleKk === "string" ? data.titleKk : "",
    excerptRu: typeof data.excerptRu === "string" ? data.excerptRu : "",
    excerptKk: typeof data.excerptKk === "string" ? data.excerptKk : "",
    contentRu: typeof data.contentRu === "string" ? data.contentRu : "",
    contentKk: typeof data.contentKk === "string" ? data.contentKk : "",
    eventDate: typeof data.eventDate === "string" ? data.eventDate : null,
  };
}

export async function GET() {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    return Response.json({ posts: await listAdminNews() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    const post = await createNews(parseInput(await request.json()), { type: "admin", id: access.user.userId });
    return Response.json({ post }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object") throw new Error("Некорректные данные");
    const data = payload as Record<string, unknown>;
    const id = typeof data.id === "string" ? data.id : "";
    if (!id) throw new Error("Не указана публикация");
    const input = parseInput(data);
    const status = data.status === "archived" ? "archived" : input.status;
    const post = await updateNews(id, { ...input, status }, { type: "admin", id: access.user.userId });
    return Response.json({ post });
  } catch (error) {
    return errorResponse(error);
  }
}
