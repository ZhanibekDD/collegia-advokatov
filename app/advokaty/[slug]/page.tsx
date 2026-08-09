import { notFound } from "next/navigation";
import { advocates } from "../../lib/portal-data";
import ProfileClient from "./profile-client";

export function generateStaticParams() {
  return advocates.map((advocate) => ({ slug: advocate.slug }));
}

export default async function AdvocateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const advocate = advocates.find((item) => item.slug === slug);
  if (!advocate) notFound();
  return <ProfileClient advocate={advocate} />;
}
