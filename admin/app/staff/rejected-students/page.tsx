"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Mail, Plus, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";

import {
  AlertDialog,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { usePeriod } from "@/components/staff/period-context";

import { columns } from "./columns";

type RejectedStudent =
  RouterOutputs["staff"]["rejectedStudents"]["list"][number];

const SEND_LIMIT = 20;
const PAGE_SIZE = 50;

type Tab = "new" | "sent";

export default function RejectedStudentsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("new");
  const [addOpen, setAddOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const { period } = usePeriod();
  const trpc = useTRPC();
  const {
    data: rejectedStudents,
    isPending,
    error,
  } = useQuery(trpc.staff.rejectedStudents.list.queryOptions({ period }));

  const unsent = useMemo(
    () => rejectedStudents?.filter((student) => !student.emailSent) ?? [],
    [rejectedStudents]
  );

  const stats = useMemo(() => {
    const total = rejectedStudents?.length ?? 0;
    const sent = total - unsent.length;
    return { total, sent, notSent: unsent.length };
  }, [rejectedStudents, unsent]);

  const filtered = useMemo(() => {
    if (!rejectedStudents) return [];
    const query = search.toLowerCase();
    return rejectedStudents.filter(
      (student) =>
        (tab === "sent" ? student.emailSent : !student.emailSent) &&
        (!query || student.email.toLowerCase().includes(query))
    );
  }, [rejectedStudents, search, tab]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  return (
    <div className="container">
      <h1>Rejected Students — Period {period}</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Students"
          value={stats.total}
          accent="border-l-blue-500"
        />
        <StatCard
          label="Email Sent"
          value={stats.sent}
          accent="border-l-green-500"
        />
        <StatCard
          label="Email Not Sent"
          value={stats.notSent}
          accent="border-l-orange-500"
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <InputGroup className="w-full max-w-48">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button
          variant="outline"
          className="ml-auto"
          disabled={unsent.length === 0}
          onClick={() => setSendOpen(true)}
        >
          <Mail /> Send Rejection Emails ({unsent.length})
        </Button>
        <Button onClick={() => setAddOpen(true)}>
          <Plus /> Add
        </Button>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as Tab)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="new">New ({stats.notSent})</TabsTrigger>
          <TabsTrigger value="sent">Email Sent ({stats.sent})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable isLoading={isPending} table={table} error={error} />

      {table.getPageCount() > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} — {filtered.length} student
            {filtered.length === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          {addOpen && <AddContent onClose={() => setAddOpen(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={sendOpen} onOpenChange={setSendOpen}>
        <AlertDialogContent>
          {sendOpen && (
            <SendContent unsent={unsent} onClose={() => setSendOpen(false)} />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <Card className={`border-l-4 ${accent}`}>
    <CardContent>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

const addFormSchema = z.object({
  email: z.email({ message: "A valid email is required" }),
});

const AddContent = ({ onClose }: { onClose: () => void }) => {
  const trpc = useTRPC();
  const { period } = usePeriod();

  const createRejected = useMutation(
    trpc.staff.rejectedStudents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.rejectedStudents.list.pathKey(),
        });
        toast.success("Rejected student added");
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },
    })
  );

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: { email: "" },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Rejected Student — Period {period}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit((values) =>
          createRejected.mutate({ email: values.email, period })
        )}
        className="flex w-full flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createRejected.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createRejected.isPending}>
            {createRejected.isPending && <Spinner />}
            Add
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const SendContent = ({
  unsent,
  onClose,
}: {
  unsent: RejectedStudent[];
  onClose: () => void;
}) => {
  const trpc = useTRPC();
  const { period } = usePeriod();

  const sendEmails = useMutation(
    trpc.staff.rejectedStudents.sendRejectionEmails.mutationOptions({
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.rejectedStudents.list.pathKey(),
        });
        toast.success(
          `${result.sent} rejection email${result.sent === 1 ? "" : "s"} sent${
            result.remaining > 0 ? ` — ${result.remaining} remaining` : ""
          }`
        );
        if (result.failed.length > 0) {
          toast.error(`Failed to send to: ${result.failed.join(", ")}`);
        }
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send rejection emails");
      },
    })
  );

  const batch = unsent.slice(0, SEND_LIMIT);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <Mail />
        </AlertDialogMedia>
        <AlertDialogTitle>
          Send Rejection Emails — Period {period}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {batch.length} of {unsent.length} unsent email
          {unsent.length === 1 ? "" : "s"} will be sent now (max {SEND_LIMIT}{" "}
          per batch).
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="text-muted-foreground max-h-48 overflow-y-auto rounded-md border p-3 text-xs">
        {batch.map((student) => (
          <div key={student.id}>{student.email}</div>
        ))}
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          disabled={sendEmails.isPending}
          onClick={() => sendEmails.mutate({ period })}
        >
          {sendEmails.isPending && <Spinner />}
          Send {batch.length} email{batch.length === 1 ? "" : "s"}
        </Button>
      </AlertDialogFooter>
    </>
  );
};
