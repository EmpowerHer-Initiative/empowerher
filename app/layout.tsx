import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/services/trpc/client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { UserControl } from "@/components/user-control";

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
  icons: {
    icon: "https://cdn.empowerher-initiative.org/logo.png",
  },
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
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
        fontSerif.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider defaultTheme="light">
            <NuqsAdapter>
              <Suspense fallback={null}>
                <UserControl />
                {children}
              </Suspense>
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
