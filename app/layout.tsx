import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThomasUnderPar — Golf Travel Guides",
  description:
    "Expert golf travel guides with real course reviews, scores, and destination tips for golfers who travel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
