import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header"; // 1. Header 임포트

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HanaBlog", // 블로그 이름으로 변경
  description: "My Personal Dev Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}
      >
        <Providers>
          {/* 2. Header를 Providers 내부에, children 위에 배치 */}
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
