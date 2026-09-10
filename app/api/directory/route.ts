import { getPublicDirectory } from "../../lib/content-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const directory = await getPublicDirectory();
  return Response.json(directory, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
