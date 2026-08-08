"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalLink, Pencil, Plus, Trash } from "lucide-react";
import { Reorder } from "motion/react";
import { toast } from "sonner";

import { agency } from "@/lib/agency-api";
import { CACHE_TAGS } from "@/services/cache/tags";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RevalidateButton } from "@/components/admin/revalidate-button";

import { PartnerForm } from "./partner-form";

type Partner = RouterOutputs["admin"]["partners"]["list"][number];

export default function PartnersPage() {
  const [addOpen, setAddOpen] = useState(false);

  const trpc = useTRPC();
  const { data: partners, isPending } = useQuery(
    trpc.admin.partners.list.queryOptions()
  );

  // Local drag order, re-synced whenever the server list changes
  const [ordered, setOrdered] = useState<Partner[]>([]);
  const [prevPartners, setPrevPartners] = useState(partners);
  if (partners !== prevPartners) {
    setPrevPartners(partners);
    setOrdered(partners ?? []);
  }

  const reorderPartners = useMutation(
    trpc.admin.partners.reorder.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.partners.list.pathKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to reorder partners");
        // Revert to the server order
        queryClient.invalidateQueries({
          queryKey: trpc.admin.partners.list.pathKey(),
        });
      },
    })
  );

  const commitOrder = () => {
    const unchanged =
      partners && ordered.every((partner, i) => partner.id === partners[i]?.id);
    if (unchanged) return;
    reorderPartners.mutate(ordered.map((partner) => partner.id));
  };

  return (
    <div className="container">
      <h1>Partners</h1>
      <div className="mb-4 flex items-center justify-end gap-2">
        <RevalidateButton
          tag={CACHE_TAGS.partners}
          label="Publish"
          description="Update the live pages"
          subject="partners"
        />
        <Button onClick={() => setAddOpen(true)}>
          <Plus /> Add Partner
        </Button>
      </div>
      {isPending ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={ordered}
          onReorder={setOrdered}
          className="flex flex-col gap-4"
        >
          {ordered.map((partner) => (
            <Reorder.Item
              key={partner.id}
              value={partner}
              onDragEnd={commitOrder}
              className="cursor-grab active:cursor-grabbing"
            >
              <PartnerCard partner={partner} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
      {!isPending && partners?.length === 0 && (
        <p className="text-muted-foreground text-sm">No partners yet.</p>
      )}
      <PartnerForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

const PartnerCard = ({ partner }: { partner: Partner }) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deletePartner = useMutation(
    trpc.admin.partners.delete.mutationOptions({
      onSuccess: () => {
        // Row is gone — remove its logo from storage (best-effort)
        void agency.uploads.delete({ key: partner.image });
        queryClient.invalidateQueries({
          queryKey: trpc.admin.partners.list.pathKey(),
        });
        toast.success("Partner deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete partner");
      },
    })
  );

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5">
          <img
            src={partner.image}
            alt={partner.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-col -space-y-0.5">
          <span className="truncate font-medium">{partner.name}</span>
          <a
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 truncate text-sm"
          >
            {partner.link}
            <ExternalLink className="size-3 shrink-0" />
          </a>
        </div>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash />
          </Button>
        </div>
      </CardContent>

      <PartnerForm
        partner={partner}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {partner.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deletePartner.isPending}
              onClick={() =>
                deletePartner.mutate(partner.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete partner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
