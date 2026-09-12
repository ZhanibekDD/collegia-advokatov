import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новости и мероприятия",
  description: "Новости, мероприятия и официальные объявления Коллегии адвокатов области Жетісу.",
};

export default function NewsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
