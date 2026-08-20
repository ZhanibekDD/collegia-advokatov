import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Жетісуская областная коллегия адвокатов",
    template: "%s · Жетісуская областная коллегия адвокатов",
  },
  description:
    "Цифровой портал Жетісуской областной коллегии адвокатов: поиск адвокатов области Жетісу по ФИО и номеру лицензии, навигатор правовой помощи и сведения из открытых данных Министерства юстиции РК.",
  keywords: [
    "Жетісуская областная коллегия адвокатов",
    "коллегия адвокатов Жетісу",
    "адвокат Талдыкорган",
    "адвокат область Жетісу",
    "найти адвоката Жетісу",
    "Жетісу облыстық адвокаттар алқасы",
    "Талдықорған адвокат",
  ],
  openGraph: {
    title: "Жетісуская областная коллегия адвокатов",
    description: "Поиск адвокатов и понятный маршрут к правовой помощи в области Жетісу.",
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
