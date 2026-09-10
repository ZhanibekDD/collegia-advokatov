import { listPublishedNews } from "../../lib/content-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim() || undefined;
  const posts = await listPublishedNews(slug);
  return Response.json({ posts }, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
