"use client";

import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type AllStudent = RouterOutputs["admin"]["allStudents"]["list"][number];

export const columns: ColumnDef<AllStudent>[] = [
  {
    header: "Email",
    cell: ({ row }) => <div className="font-medium">{row.original.email}</div>,
  },
  {
    header: "Added",
    cell: ({ row }) => format(row.original.createdAt, "MMMM d, yyyy"),
  },
];
