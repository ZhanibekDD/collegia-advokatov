import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicDirectory } from "../../lib/content-service";
import ProfileClient from "./profile-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Карточка адвоката",
  description: "Сведения из актуального реестра Коллегии адвокатов области Жетісу.",
};

export default async function AdvocateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const directory = await getPublicDirectory();
  const advocate = directory.advocates.find((item) => item.id === slug);
  if (!advocate) notFound();
  return <ProfileClient advocate={advocate} total={directory.meta.total} ggupTotal={directory.meta.ggup.total} />;
}
