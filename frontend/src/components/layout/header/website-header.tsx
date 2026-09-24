"use client";
import Link from "next/link";
import { Button } from "@/components/core/button";
import ModeToggle from "@/components/core/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/core/navigation-menu";

export default function WebsiteHeader() {
  return (
    <header
      className="fixed z-50 w-full flex items-center justify-between bg-background backdrop-blur-xs p-2 px-website
  border-b border-border"
    >
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center hover:scale-98 transition-transform"
        >
          <h3 className="flex items-center !text-2xl !font-medium">
            React Map tools
          </h3>
        </Link>
        <NavigationMenu className="mt-2 hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/docs" className="">
                  Docs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="w-fit flex items-center gap-3">
        <ModeToggle shadcnButton={true} tooltipSide="bottom" />
        <nav className="flex gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="default" size="sm" className="px-4">
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="contrast" size="sm" className="px-4 h-7">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
