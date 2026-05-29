import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeWrapper from "@/components/providers/ThemeWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniScope | College Discovery & Decision-Making Platform",
  description: "Search, compare, and discover India's top colleges. Predict cutoff ranks, examine placement packages, and save comparisons for your academic journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeWrapper>
            <Header />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
            <ChatbotWidget />
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
