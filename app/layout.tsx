import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AI Ops Hub",
  description: "AI-powered RCA Analyzer and Relationship Manager Chatbot.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} style={{ backgroundColor: "#f8fafc" }}>
      <body
        style={{
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          color: "#1e293b",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <NavBar />
        <main style={{ flex: 1, position: "relative", zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
