"use client";

import Link from "next/link";
import { Separator } from "@/components/core/separator";
import ModeToggle from "@/components/core/mode-toggle";

export default function WebsiteFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-between">
      <Separator orientation="horizontal" />
      <div className="flex items-center justify-between py-4 gap-4 w-full">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} React map tools. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="text-muted-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-muted-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
        <ModeToggle
          shadcnButton={true}
          tooltipSide="top"
          className="!text-contrast"
        />
      </div>
    </footer>
  );
}
