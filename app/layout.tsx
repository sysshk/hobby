import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "위대한 전당 | Great Park",
  description: "함께 만들어가는 더 나은 세상 - 아이디어 공유 플랫폼",
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
