import { notFound } from "next/navigation";
import directoryData from "../../../public/data/advocates.json";
import { ZHETISU_REGION, type AdvocateDirectory } from "../../lib/portal-data";
import ProfileClient from "./profile-client";

const directory = directoryData as AdvocateDirectory;
const zhetysuAdvocates = directory.advocates.filter((item) => item.region === ZHETISU_REGION);

export default async function AdvocateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const advocate = zhetysuAdvocates.find((item) => item.id === slug);
  if (!advocate) notFound();
  return <ProfileClient advocate={advocate} total={zhetysuAdvocates.length} />;
}
