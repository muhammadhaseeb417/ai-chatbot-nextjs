import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switched to Inter
import "./globals.css";

// Inter is widely considered the standard for modern "Pro" UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "Secure AI chatbot with advanced conversational capabilities",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}