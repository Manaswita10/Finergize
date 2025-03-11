import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/chatbot-animations.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthProvider from "@/components/providers/session-provider";
import ChatbotProvider from "@/components/providers/ChatbotProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finergise - Digital Banking for Rural Communities",
  description: "Access banking services right from your community with secure and easy-to-use digital banking solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <AuthProvider>
            <Navbar />
            <ChatbotProvider>
              {children}
            </ChatbotProvider>
            <Toaster />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}