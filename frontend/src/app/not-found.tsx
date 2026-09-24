// app/notfound.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /error page after 1 second
    setTimeout(() => {
      router.push("/error");
    }, 1);
  }, [router]);

  return (
    null
  );
}