import { adminApiAccess } from "../../../lib/admin-auth";
import { getContentStats } from "../../../lib/content-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await adminApiAccess();
  if (!access.ok) return access.response;
  try {
    return Response.json(await getContentStats());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Не удалось получить состояние" }, { status: 500 });
  }
}
