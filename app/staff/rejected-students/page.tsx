"use client";

import { useMemo, useState } from "react";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Plus, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { DataTable } from "@/components/data-table";
import { usePeriod } from "@/components/staff/period-context";

import { columns } from "./columns";

type RejectedStudent =
  RouterOutputs["staff"]["rejectedStudents"]["list"][number];

const SEND_LIMIT = 20;

export default function RejectedStudentsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const { period } = usePeriod();
  const trpc = useTRPC();
  const {
    data: rejectedStudents,
    isPending,
    error,
  } = useQuery(trpc.staff.rejectedStudents.list.queryOptions({ period }));

  const filtered = useMemo(() => {
    if (!rejectedStudents) return [];
    if (!search) return rejectedStudents;
    const query = search.toLowerCase();
    return rejectedStudents.filter((student) =>
      student.email.toLowerCase().includes(query)
    );
  }, [rejectedStudents, search]);

  const unsent = useMemo(
    () => rejectedStudents?.filter((student) => !student.emailSent) ?? [],
    [rejectedStudents]
  );

  return (
    <div className="container">
      <h1>Rejected Students — Period {period}</h1>
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
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={filtered}
        error={error}
      />

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
