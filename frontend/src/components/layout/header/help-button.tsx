"use client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/core/dropdown-menu";
import {
  HelpCircle,
  HeartHandshake,
  BookCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/core/button";

export default function HelpButton() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={5}>
        <DropdownMenuLabel>Help</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          key={"support"}
          className=""
          onClick={() => router.push("/")}
        >
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5" />
            <div className="flex items-center gap-2">
              Contact Support <ExternalLink className="text-contrast" />
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          key={"documentation"}
          className=""
          onClick={() => router.push("/")}
        >
          <div className="flex items-center gap-2">
            <BookCheck className="h-5 w-5" />
            <div className="flex items-center gap-2">
              Docs <ExternalLink className="text-contrast" />
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
