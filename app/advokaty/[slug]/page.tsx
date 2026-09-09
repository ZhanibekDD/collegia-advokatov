import type { Metadata } from "next";
import { notFound } from "next/navigation";
import directoryData from "../../../public/data/advocates-september-2026.json";
import type { AdvocateDirectory } from "../../lib/portal-data";
import ProfileClient from "./profile-client";

const directory = directoryData as AdvocateDirectory;

export function generateStaticParams() {
  return directory.advocates.map((advocate) => ({ slug: advocate.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const advocate = directory.advocates.find((item) => item.id === slug);
  return advocate
    ? { title: advocate.name, description: `${advocate.name} — член Коллегии адвокатов области Жетісу.` }
    : {};
}

export default async function AdvocateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const advocate = directory.advocates.find((item) => item.id === slug);
  if (!advocate) notFound();
  return <ProfileClient advocate={advocate} total={directory.meta.total} />;
}
