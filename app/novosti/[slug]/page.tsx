import NewsArticleClient from "./news-article-client";
import { listPublishedNews } from "../../lib/content-service";

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await listPublishedNews(slug);
  return <NewsArticleClient initialPost={post ?? null} />;
}
