import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Список адвокатов",
  description: "Актуальный список адвокатов Коллегии адвокатов области Жетісу на 1 сентября 2026 года.",
};

export default function AdvocatesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
