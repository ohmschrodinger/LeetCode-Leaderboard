import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "LeetBoard - LeetCode Leaderboard",
  description: "Track and compete with your friends on LeetCode",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        {children}
      </body>
    </html>
  );
}
