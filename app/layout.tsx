import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import Header from "@/components/homepage/layout/header";
import Announcement from "@/components/homepage/layout/announcement";
import { CartProvider } from "@/contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demo Shop - Portfolio Project",
  description: "A demo e-commerce shop showcasing modern web development practices. This is a portfolio demonstration project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          <Announcement href="/products" text="25% Sale on all Products" />
          <main>
            {children}
          </main>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
