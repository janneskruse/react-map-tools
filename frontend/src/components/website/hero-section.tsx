"use client";

import Link from "next/link";
import { Button } from "@/components/core/button";


export function HeroSection() {

  return (
    <section className="bg-globe w-full min-h-dvh max-h-dvh flex flex-col items-center justify-end pt-20 relative">
      <div className="w-full h-full flex flex-col flex-grow items-center justify-center relative">
        <div className="flex flex-wrap gap-4 p-4 lg:p-8 mx-4 my-8 bg-background/30 backdrop-blur-xs rounded-sm z-30">
          <Link href="/projects/example" className="flex-1">
            <Button
              variant="default"
              size="lg"
              className="w-full px-4 md:px-8 py-3 md:py-6 md:text-md lg:text-lg"
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}