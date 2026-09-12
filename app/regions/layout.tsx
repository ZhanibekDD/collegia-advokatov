import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О коллегии",
  description: "Руководство, реквизиты и официальные контакты Коллегии адвокатов области Жетісу.",
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
