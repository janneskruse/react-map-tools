"use client";

import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog";

interface WebGLSupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WebGLSupport({ open, onOpenChange }: WebGLSupportProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unable to display the map</DialogTitle>
          <DialogDescription>
            This map requires WebGL2. Your browser could not start graphics
            rendering. Graphics acceleration may be disabled, or your browser or
            device may not support WebGL2.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Enable graphics or hardware acceleration in your browser settings,
            if available.
          </li>
          <li>Restart your browser, then open this page again.</li>
          <li>
            If the map still does not load, update your browser and graphics
            drivers, or try another browser or device that supports WebGL2.
          </li>
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
