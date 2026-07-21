"use client";

import { useState } from "react";
import { Info, RefreshCw, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { revalidateSection } from "@/services/cache/actions";
import { type CacheTag } from "@/services/cache/tags";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RevalidateButtonProps {
  label: string;
  description: string;
  subject: string;
  tag: CacheTag;
  icon?: LucideIcon;
}

export const RevalidateButton = ({
  label,
  description,
  subject,
  tag,
  icon: Icon = RefreshCw,
}: RevalidateButtonProps) => {
  const [pending, setPending] = useState(false);

  const revalidate = async () => {
    setPending(true);
    try {
      const res = await revalidateSection(tag);
      if (res.error) throw new Error(res.error);
      toast.success("Changes published");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        onClick={revalidate}
        disabled={pending}
        className="h-auto flex-col gap-0 py-2"
      >
        <span className="flex items-center gap-2 self-start">
          <Icon className={pending ? "animate-spin" : undefined} />
          {label}
        </span>
        <span className="text-muted-foreground text-xs font-normal">
          {description}
        </span>
      </Button>

      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="How publishing works"
            />
          }
        >
          <Info />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How changes go live</DialogTitle>
            <DialogDescription>
              Saving and publishing are two separate steps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Changes save automatically</p>
              <p className="text-muted-foreground">
                When you add, edit, or remove {subject}, the changes are saved
                to the database instantly — no extra publish step needed.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">The public page is cached</p>
              <p className="text-muted-foreground">
                The page your visitors see is a saved snapshot. This keeps the
                site fast, but it does not update on its own.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Publish to go live</p>
              <p className="text-muted-foreground">
                After making changes, click the <strong>Publish</strong> button
                to refresh the snapshot. Until you do, visitors will see the
                previous version.
              </p>
            </div>
          </div>

          <Alert>
            <Info />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              Make all your edits first, then press the button once.
            </AlertDescription>
          </Alert>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
};
