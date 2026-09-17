import { listPublishedNews } from "../lib/content-service";
import NewsPageClient from "./news-page-client";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await listPublishedNews();
  return <NewsPageClient initialPosts={posts} />;
}
