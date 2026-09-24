import type { Metadata } from "next";
import { Geist, Geist_Mono, SUSE } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "@/components/core/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import { cn } from "cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const suse = SUSE({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React map tools",
  description: "Base setup for your map project.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("min-w-50", "antialiased", geistSans.variable, geistMono.variable, suse.variable, "font-sans")}
    >
      <body>
        {children}
        <Toaster position="bottom-right" visibleToasts={3} closeButton />
        <TailwindIndicator />
      </body>
    </html>
  );
}
