import { notFound } from "next/navigation";
import directoryData from "../../../public/data/advocates.json";
import type { AdvocateDirectory } from "../../lib/portal-data";
import ProfileClient from "./profile-client";

const directory = directoryData as AdvocateDirectory;

export default async function AdvocateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const advocate = directory.advocates.find((item) => item.id === slug);
  if (!advocate) notFound();
  return <ProfileClient advocate={advocate} total={directory.meta.total} />;
}
