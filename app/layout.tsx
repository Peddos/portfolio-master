import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio Engine — Build Your Professional Story",
  description:
    "AI-powered portfolio builder. Submit your info, get a stunning portfolio in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-[#ECECEC] antialiased lg:cursor-none">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
