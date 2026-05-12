import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import { CatLoader } from "@/components/CatLoader";

import { SmoothScrollProvider } from "@/lib/lenis";

import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agency OS - Assignment Koran",
  description: "Modern Agency Management System",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300`}>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <SmoothScrollProvider>
                <CatLoader />
                <CustomCursor />
                {children}
              </SmoothScrollProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
