import NewsArticleClient from "./news-article-client";

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsArticleClient slug={slug} />;
}
