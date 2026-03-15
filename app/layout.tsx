import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Suspense } from "react";
import { TRPCReactProvider } from "@/services/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            <NuqsAdapter>
              <Suspense>
                <Navbar />
                {children}
                <Footer />
              </Suspense>
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
