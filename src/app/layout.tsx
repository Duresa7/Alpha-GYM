import type { Metadata } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar, MobileTabBar } from "@/components/layout/app-sidebar";
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
          <main className="min-w-0 flex-1 px-3 pb-24 pt-4 sm:px-5 md:pb-8 md:pt-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
          <MobileTabBar />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
