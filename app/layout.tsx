import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Penicillin MES | 배양 공정관리 시스템",
  description: "페니실린 발효/배양 공정 실행·모니터링 시스템 (Manufacturing Execution System)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} font-[Outfit] antialiased`}>
        {children}
      </body>
    </html>
  );
}
