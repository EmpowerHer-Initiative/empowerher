import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Suspense } from "react";
import { TRPCReactProvider } from "@/services/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

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
                <AdminToolbar />
              </Suspense>
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
