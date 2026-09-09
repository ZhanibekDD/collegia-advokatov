import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Юридические консультации",
  description: "Городские, районные и ювенальная юридические консультации Коллегии адвокатов области Жетісу.",
};

export default function ConsultationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
