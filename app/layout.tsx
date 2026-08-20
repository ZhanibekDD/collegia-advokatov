import type { Metadata } from "next";
import "./globals.css";

const jetisuEmblem =
  "https://upload.wikimedia.org/wikipedia/commons/f/f1/%D0%93%D0%B5%D1%80%D0%B1_%D0%96%D0%B5%D1%82%D1%8B%D1%81%D1%83%D1%81%D0%BA%D0%BE%D0%B9_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8.svg";

export const metadata: Metadata = {
  title: {
    default: "Коллегия адвокатов области Жетісу",
    template: "%s · Коллегия адвокатов области Жетісу",
  },
  description:
    "Цифровой портал Коллегии адвокатов области Жетісу: поиск адвокатов региона по ФИО и номеру лицензии, навигатор правовой помощи и сведения из открытых данных Министерства юстиции РК.",
  keywords: [
    "Коллегия адвокатов области Жетісу",
    "коллегия адвокатов Жетісу",
    "адвокат Талдыкорган",
    "адвокат область Жетісу",
    "найти адвоката Жетісу",
    "Жетісу облыстық адвокаттар алқасы",
    "Талдықорған адвокат",
  ],
  openGraph: {
    title: "Коллегия адвокатов области Жетісу",
    description: "Поиск адвокатов и понятный маршрут к правовой помощи в области Жетісу.",
    locale: "ru_KZ",
    alternateLocale: "kk_KZ",
    type: "website",
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  icons: {
    icon: [{ url: jetisuEmblem, type: "image/svg+xml" }],
    shortcut: jetisuEmblem,
    apple: jetisuEmblem,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
