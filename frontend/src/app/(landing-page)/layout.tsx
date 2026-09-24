"use server";

import WebsiteHeader from "@/components/layout/header/website-header";
import WebsiteFooter from "@/components/layout/footer/website-footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col items-center justify-between w-full h-full bg-background">
      <WebsiteHeader />
      <div className="flex flex-col items-center justify-between w-full h-dvh overflow-y-auto">
        {children}
        <WebsiteFooter />
      </div>
    </div>
  );
}