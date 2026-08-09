import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Коллегии адвокатов Республики Казахстан",
  description:
    "Каталог 6 005 адвокатов Казахстана по открытым данным Министерства юстиции РК: поиск по ФИО, лицензии и региону.",
  keywords: [
    "адвокат Казахстан",
    "коллегия адвокатов",
    "найти адвоката",
    "юридическая помощь Казахстан",
    "Қазақстан адвокаты",
  ],
  openGraph: {
    title: "Коллегии адвокатов Республики Казахстан",
    description: "Поиск по 6 005 записям открытого набора Министерства юстиции Республики Казахстан.",
    locale: "ru_KZ",
    alternateLocale: "kk_KZ",
    type: "website",
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
