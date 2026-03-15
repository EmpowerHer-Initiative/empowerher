"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";

interface FilterUsers {
  page?: number;
  limit?: number;
  sortBy?: "email" | "created" | "banned";
  search?: string;
}

const sortByOptions: FilterUsers["sortBy"][] = ["email", "created", "banned"];

export type User = {
  id: string;
  userName: string;
  description: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Deleted";
  addDate: Date;
  lastActive: Date;
  access: boolean;
};

const FAKE_USERS: User[] = [
  {
    id: "1",
    userName: "Kathryn Murphy",
    description: "Description Text",
    email: "nevaeh.simmons@example.com",
    role: "Admin",
    status: "Active",
    addDate: new Date("2013-03-23"),
    lastActive: new Date("2015-07-14"),
    access: true,
  },
  {
    id: "2",
    userName: "Savannah Nguyen",
    description: "Description Text",
    email: "debbie.baker@example.com",
    role: "Admin",
    status: "Inactive",
    addDate: new Date("2018-10-24"),
    lastActive: new Date("2015-05-31"),
    access: false,
  },
  {
    id: "3",
    userName: "Dianne Russell",
    description: "Description Text",
    email: "felicia.reid@example.com",
    role: "Admin",
    status: "Active",
    addDate: new Date("2017-08-07"),
    lastActive: new Date("2014-02-11"),
    access: true,
  },
  {
    id: "4",
    userName: "Esther Howard",
    description: "Description Text",
    email: "jackson.graham@example.com",
    role: "Admin",
    status: "Deleted",
    addDate: new Date("2016-04-28"),
    lastActive: new Date("2019-10-25"),
    access: false,
  },
  {
    id: "5",
    userName: "Cameron Williamson",
    description: "Description Text",
    email: "cameron.w@example.com",
    role: "Admin",
    status: "Active",
    addDate: new Date("2019-01-15"),
    lastActive: new Date("2024-03-01"),
    access: true,
  },
  {
    id: "6",
    userName: "Jane Cooper",
    description: "Description Text",
    email: "jane.cooper@example.com",
    role: "Admin",
    status: "Inactive",
    addDate: new Date("2020-06-12"),
    lastActive: new Date("2023-11-20"),
    access: false,
  },
  {
    id: "7",
    userName: "Robert Fox",
    description: "Description Text",
    email: "robert.fox@example.com",
    role: "Admin",
    status: "Active",
    addDate: new Date("2015-09-03"),
    lastActive: new Date("2025-02-28"),
    access: true,
  },
  {
    id: "8",
    userName: "Kristin Watson",
    description: "Description Text",
    email: "kristin.watson@example.com",
    role: "Admin",
    status: "Deleted",
    addDate: new Date("2017-12-08"),
    lastActive: new Date("2020-04-15"),
    access: false,
  },
  {
    id: "9",
    userName: "Jacob Jones",
    description: "Description Text",
    email: "jacob.jones@example.com",
    role: "Admin",
    status: "Active",
    addDate: new Date("2021-03-22"),
    lastActive: new Date("2025-01-10"),
    access: true,
  },
  {
    id: "10",
    userName: "Leslie Alexander",
    description: "Description Text",
    email: "leslie.alexander@example.com",
    role: "Admin",
    status: "Inactive",
    addDate: new Date("2018-07-19"),
    lastActive: new Date("2022-08-05"),
    access: false,
  },
];

const statusVariant: Record<
  User["status"],
  "default" | "destructive" | "outline"
> = {
  Active: "default",
  Inactive: "destructive",
  Deleted: "outline",
};

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: "User Name",
    cell: ({ row }) => {
      const name = row.original.userName;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {initials}
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-muted-foreground text-xs">
              {row.original.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "role",
    header: "User Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "addDate",
    header: "Add Date",
    cell: ({ row }) => format(row.original.addDate, "MMMM d, yyyy"),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => format(row.original.lastActive, "MMMM d, yyyy"),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Action</span>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="xs"
        className="size-8 p-0"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Actions for ${row.original.userName}`}
      >
        <MoreHorizontal className="size-4" />
      </Button>
    ),
  },
];

export default function UsersPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data: FAKE_USERS,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold">User Details</h1>
      <p className="text-muted-foreground mt-1">
        {table.getFilteredRowModel().rows.length} users
      </p>

      <div className="space-y-4">
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users"
              className="w-full max-w-sm"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Select>
              <SelectTrigger className="w-[180px] capitalize">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    <span className="capitalize">
                      {item?.replace("_", " ")}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button>Add User</Button>
        </div>

        <DataTable table={table} />

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            from {table.getFilteredRowModel().rows.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
