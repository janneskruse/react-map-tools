"use client";
import { useState, useCallback } from "react";

import { MoreVertical, Copy, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/general-ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/general-ui/dialog";
import Spinner from "@/components/general-ui/custom-spinner";
import { Button } from "@/components/general-ui/button";
import { triggerToast } from "@/components/general-ui/custom-toast";
import Banner from "@/components/general-ui/custom-banner";

import { cn } from "@/utils/shadcn-utils";

import type { TTreeItem } from "@/types/drag-and-drop";

export type ItemHandleProps = {
  item: TTreeItem;
  uniqueContextId: symbol;
  copy?: boolean;
  handleDuplicate?: (itemId: string) => Promise<void>;
  handleDelete?: (itemId: string) => Promise<void>;
  className?: string;
};

export function ItemHandle({
  item,
  uniqueContextId,
  copy,
  handleDuplicate,
  handleDelete,
  className = "",
}: ItemHandleProps) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDialogOpen] = useState(false);

  const handleDuplicateData = useCallback(async () => {
    if (!handleDuplicate) {
      console.error("handleDuplicate function is not provided");
      return;
    }
    setLoading(true);
    try {
      await handleDuplicate(item.id);

      triggerToast({
        title: "Item Duplicated",
        description: (
          <Banner closeButton={false} showIcon variant="success">
            Item {item.name} duplicated.
          </Banner>
        ),
      });
    } catch (error) {
      console.error("Error duplicating item: ", error);
      triggerToast({
        title: "Error!",
        description: (
          <Banner closeButton={false} showIcon variant="error">
            Something went wrong while duplicating your item. Please try again
            or contact support.
          </Banner>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [handleDuplicate, item.id, item.name]);

  const handledeleteData = useCallback(async () => {
    if (!handleDelete) {
      console.error("handleDelete function is not provided");
      return;
    }
    setLoading(true);
    try {
      await handleDelete(item.id);

      triggerToast({
        title: "item Deleted",
        description: (
          <Banner closeButton={false} showIcon variant="success">
            item successfully deleted.
          </Banner>
        ),
      });
    } catch (error) {
      console.error("Error deleting user: ", error);
      triggerToast({
        title: "Error!",
        description: (
          <Banner closeButton={false} showIcon variant="error">
            Something went wrong while deleting your item. Please try again or
            contact support.
          </Banner>
        ),
      });
    } finally {
      setDialogOpen(false);
      setLoading(false);
    }
  }, [handleDelete, item.id]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className={cn("w-4 h-4 cursor-pointer hover:text-contrast/80\
           data-[state=open]:!block data-[state=open]:!opacity-100",
           className)} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 rounded-sm"
          side="right"
          align="start"
        >
          {copy && (
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    JSON.stringify({
                      item: item,
                      uniqueContextId: uniqueContextId.toString(),
                    })
                  )
                  .then(
                    () => {
                      triggerToast({
                        title: "Item copied to your clipboard.",
                        timeout: 2000,
                      });
                    },
                    (err) => {
                      console.error("Could not copy item: ", err);
                    }
                  );
              }}
            >
              <Copy className="size-3" />
              <span>Copy item</span>
            </DropdownMenuItem>
          )}
          {handleDuplicate && (
            <DropdownMenuItem
              className="text-xs"
              onClick={handleDuplicateData}
              disabled={loading}
            >
              <Copy className="size-3" />
              <span>Duplicate item</span>
            </DropdownMenuItem>
          )}
          {handleDelete && (
            <DropdownMenuItem
              className={
                "text-xs text-destructive hover:!text-destructive data-[disabled]:hover:!text-muted-foreground data-[disabled]:text-muted-foreground data-[disabled]:[&_svg]:text-muted-foreground"
              }
              onClick={() => setDialogOpen(true)}
            >
              <Trash2 className="text-destructive size-3" />
              <span>Delete item</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={() => (deleteDialogOpen ? setDialogOpen(false) : null)}
      >
        <DialogContent className="min-w-50 sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="pr-10">
              Are you sure you want to delete the item &apos;{item.name}
              &apos;?{" "}
            </DialogTitle>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center">
              <Spinner variant="primary" />
              <span className="ml-2">Deleting...</span>
            </div>
          )}
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={handledeleteData}
          >
            Delete the item
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
