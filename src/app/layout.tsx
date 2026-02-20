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
        <div className="relative flex min-h-screen bg-background">
          <AppSidebar />
          <main className="relative flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="relative mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
