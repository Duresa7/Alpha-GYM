import type { Metadata } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/layout/app-sidebar";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Alpha GYM",
  description: "Track your gym and weight progression",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${barlowCondensed.variable} ${barlow.variable} font-[family-name:var(--font-barlow)] antialiased`}
      >
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
