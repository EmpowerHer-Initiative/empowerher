import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { Braces } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormattedJSON } from "@/components/json-format";

export const paymentColumns: ColumnDef<
  RouterOutputs["products"]["listAll"][number]
>[] = [
  {
    header: "Product ID",
    accessorKey: "id",
    cell: ({ row }) => {
      return <Badge>{row.original.id}</Badge>;
    },
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Price",
    accessorKey: "priceAmount",
    cell: ({ row }) => {
      return (
        <Badge className="bg-blue-500">${row.original.priceAmount / 100}</Badge>
      );
    },
  },
  {
    header: "Is Recurring",
    accessorKey: "isRecurring",
    cell: ({ row }) => {
      return <Badge>{row.original.isRecurring ? "Yes" : "No"}</Badge>;
    },
  },
  {
    header: "Interval",
    accessorKey: "recurringInterval",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.recurringInterval ?? "-"}
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      if (!row.original.createdAt) return null;
      return <div>{format(row.original.createdAt, "MM/dd/yyyy hh:mm a")}</div>;
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      if (!row.original.updatedAt) return null;
      return <div>{formatDistanceToNow(row.original.updatedAt)} ago</div>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" size="icon" data-sticky-element>
                <Braces />
              </Button>
            }
          />
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            <FormattedJSON data={row.original} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
