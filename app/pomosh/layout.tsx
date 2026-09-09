import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Правовая помощь",
  description: "Как подготовиться к обращению за правовой помощью и выбрать адвоката из актуального списка коллегии.",
};

export default function HelpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
