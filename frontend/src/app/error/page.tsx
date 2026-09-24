"use client";

import { Button } from "@/components/core/button";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="bg-globe min-h-dvh flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center m-4 p-4 py-6 w-fit rounded-lg border border-white/50 bg-white/20 shadow-lg backdrop-blur-sm">
        <h1 className="!text-9xl mb-8 text-white">404</h1>
        <h1 className="tracking-tight text-white mb-3">
          Oops! Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try refreshing the page or
          return to the homepage.
        </p>
        <div className="flex gap-4 items-center justify-center flex-wrap">
          <Button
            variant="secondary"
            size={"lg"}
            onClick={() => {
              //get previous page from history
              if (typeof window !== "undefined") {
                window.history.back();
              } else {
                router.refresh();
              }
            }}
          >
            Try Again
          </Button>
          <Button
            variant="default"
            size={"lg"}
            onClick={() => router.push("/")}
          >
            Return to the app homepage
          </Button>
        </div>
      </div>
    </div>
  );
}