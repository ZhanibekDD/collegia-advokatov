import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Коллегии адвокатов Республики Казахстан",
  description:
    "Единый портал для поиска адвоката, проверки статуса и получения профессиональной юридической помощи в Казахстане.",
  keywords: [
    "адвокат Казахстан",
    "коллегия адвокатов",
    "найти адвоката",
    "юридическая помощь Казахстан",
    "Қазақстан адвокаты",
  ],
  openGraph: {
    title: "Коллегии адвокатов Республики Казахстан",
    description: "Современный цифровой доступ к профессиональной юридической помощи.",
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
