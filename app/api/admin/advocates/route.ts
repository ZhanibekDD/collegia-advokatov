import { adminApiAccess } from "../../../lib/admin-auth";
import {
  createAdvocate,
  listAdminAdvocates,
  parseContactsInput,
  updateAdvocate,
  type AdvocateUpdate,
} from "../../../lib/content-service";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Не удалось выполнить операцию";
  return Response.json({ error: message }, { status: 400 });
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) return Number(value);
  return null;
}

export async function GET() {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    return Response.json({ advocates: await listAdminAdvocates() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object") throw new Error("Некорректные данные");
    const data = payload as Record<string, unknown>;
    const advocate = await createAdvocate({
      name: stringValue(data.name),
      region: stringValue(data.region) || "область Жетісу",
      consultation: stringValue(data.consultation),
      contacts: parseContactsInput(stringValue(data.contacts)),
      ggup2026: data.ggup2026 === true,
      ggupSourceId: optionalNumber(data.ggupSourceId),
    }, { type: "admin", id: access.user.userId });
    return Response.json({ advocate }, { status: 201 });
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
    const id = stringValue(data.id);
    if (!id) throw new Error("Не указана запись адвоката");
    const updates: AdvocateUpdate = {};
    if (typeof data.name === "string") updates.name = data.name;
    if (typeof data.region === "string") updates.region = data.region;
    if (typeof data.consultation === "string") updates.consultation = data.consultation;
    if (typeof data.contacts === "string") updates.contacts = parseContactsInput(data.contacts);
    if (typeof data.ggup2026 === "boolean") updates.ggup2026 = data.ggup2026;
    if (data.ggupSourceId !== undefined) updates.ggupSourceId = optionalNumber(data.ggupSourceId);
    if (typeof data.active === "boolean") updates.active = data.active;
    const advocate = await updateAdvocate(id, updates, { type: "admin", id: access.user.userId });
    return Response.json({ advocate });
  } catch (error) {
    return errorResponse(error);
  }
}
