"use client";
import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/core/dialog";

interface PublishProjectProps {
  projectId: string;
}

export function PublishProject({ projectId }: PublishProjectProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-7 px-4" variant="contrast" size="lg">
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-50 sm:max-w-[625px] max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish {projectId}</DialogTitle>
          <DialogDescription>This is a future feature.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
