import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://collegia-advokatov.zhanibekdauletovich.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Коллегия адвокатов области Жетісу",
    template: "%s · KAOJ.KZ",
  },
  description:
    "Официальный портал Коллегии адвокатов области Жетісу: список адвокатов, юридические консультации и контакты коллегии.",
  keywords: [
    "KAOJ.KZ",
    "Коллегия адвокатов области Жетісу",
    "адвокат Талдыкорган",
    "адвокат область Жетісу",
    "Жетісу облыстық адвокаттар алқасы",
  ],
  openGraph: {
    title: "Коллегия адвокатов области Жетісу",
    description: "Актуальный список адвокатов и юридических консультаций области Жетісу.",
    locale: "ru_KZ",
    alternateLocale: "kk_KZ",
    type: "website",
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b2028",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
