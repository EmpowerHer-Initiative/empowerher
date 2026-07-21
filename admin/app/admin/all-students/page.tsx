"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

type AllStudent = RouterOutputs["admin"]["allStudents"]["list"][number];

const AllStudentsPage = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(20)
  );
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const trpc = useTRPC();
  const {
    data: students,
    isPending,
    error,
  } = useQuery(
    trpc.admin.allStudents.list.queryOptions({
      page,
      limit,
      search: debouncedSearch || undefined,
    })
  );
  const { data: total = 0 } = useQuery(
    trpc.admin.allStudents.count.queryOptions({
      search: debouncedSearch || undefined,
    })
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  /* eslint-disable-next-line react-hooks/incompatible-library */
  const table = useReactTable<AllStudent>({
    data: students ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
  });

  const pageCount = Math.max(1, Math.ceil(total / limit));

  const copyEmails = async () => {
    setIsCopying(true);
    try {
      const emails = await queryClient.fetchQuery(
        trpc.admin.allStudents.listEmails.queryOptions({
          search: debouncedSearch || undefined,
        })
      );
      await navigator.clipboard.writeText(emails.join(", "));
      toast.success(`${emails.length} emails copied to clipboard`);
    } catch {
      toast.error("Failed to copy emails");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="container">
      <h1>All Students ({total})</h1>
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
          onClick={copyEmails}
          disabled={isCopying || total === 0}
        >
          {isCopying ? <Spinner /> : <Copy />} Copy emails
        </Button>
        <Button variant="outline" onClick={() => setBulkOpen(true)}>
          <Upload /> Bulk import
        </Button>
        <Button onClick={() => setAddOpen(true)}>
          <Plus /> Add
        </Button>
      </div>
      <DataTable isLoading={isPending} table={table} error={error} />
      <div className="bg-muted text-muted-foreground -mt-3 flex items-center justify-between rounded-b-xl p-4 pt-7 text-xs">
        <div className="flex items-center">
          {total === 0 ? 0 : page * limit - limit + 1}-
          {Math.min(page * limit, total)} of {total}
          <Separator className="mx-2 h-5!" orientation="vertical" /> Results per
          page
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="ml-2">
                  {limit}
                </Button>
              }
            />
            <DropdownMenuContent className="min-w-20">
              {[20, 50, 100].map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => {
                    setLimit(item);
                    setPage(1);
                  }}
                  data-checked={limit === item}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>
          <p className="mx-2 tabular-nums">
            <span className="text-foreground">{page}</span> / {pageCount}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= pageCount}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          {addOpen && <AddContent onClose={() => setAddOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          {bulkOpen && <BulkContent onClose={() => setBulkOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <AllStudentsPage />
    </Suspense>
  );
};

export default Page;

const addFormSchema = z.object({
  email: z.email({ message: "A valid email is required" }),
});

const AddContent = ({ onClose }: { onClose: () => void }) => {
  const trpc = useTRPC();

  const addStudent = useMutation(
    trpc.admin.allStudents.add.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.allStudents.list.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.admin.allStudents.count.pathKey(),
        });
        toast.success("Student added");
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
        <DialogTitle>Add Student Email</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit((values) => addStudent.mutate(values))}
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
            disabled={addStudent.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={addStudent.isPending}>
            {addStudent.isPending && <Spinner />}
            Add
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const BulkContent = ({ onClose }: { onClose: () => void }) => {
  const trpc = useTRPC();
  const [raw, setRaw] = useState("");

  const bulkInsert = useMutation(
    trpc.admin.allStudents.bulkInsert.mutationOptions({
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.allStudents.list.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.admin.allStudents.count.pathKey(),
        });
        toast.success(
          `${result.inserted} added${
            result.skipped > 0 ? `, ${result.skipped} skipped (duplicates)` : ""
          }`
        );
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to import emails");
      },
    })
  );

  const emails = useMemo(
    () =>
      raw
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean),
    [raw]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Bulk Import Emails</DialogTitle>
        <DialogDescription>
          Paste one email per line (or comma-separated). Duplicates are skipped.
        </DialogDescription>
      </DialogHeader>
      <Textarea
        rows={10}
        placeholder="alice@example.com&#10;bob@example.com"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={bulkInsert.isPending}
        >
          Cancel
        </Button>
        <Button
          disabled={emails.length === 0 || bulkInsert.isPending}
          onClick={() => bulkInsert.mutate(emails)}
        >
          {bulkInsert.isPending && <Spinner />}
          Import {emails.length} email{emails.length === 1 ? "" : "s"}
        </Button>
      </DialogFooter>
    </>
  );
};
