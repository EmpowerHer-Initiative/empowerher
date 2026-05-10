"use client";

import { Fragment, type ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  Table as TableType,
  useReactTable,
} from "@tanstack/react-table";
import { TRPCClientErrorBase } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "../lib/utils";

type DataTableProps<TData, TValue> = {
  isLoading?: boolean | number;
  error?: TRPCClientErrorBase<DefaultErrorShape> | null;
  className?: string;
  expandedRows?: Set<string>;
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
} & (
  | {
      table: TableType<TData>;
      onRowClick?: (row: Row<TData>) => void;
    }
  | {
      columns: ColumnDef<TData, TValue>[];
      data: TData[];
      onRowClick?: (row: Row<TData>) => void;
    }
);

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const tableConfig =
    "table" in props
      ? props.table
      : // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/incompatible-library
        useReactTable({
          data: props.data,
          columns: props.columns,
          getCoreRowModel: getCoreRowModel(),
        });

  const {
    onRowClick,
    className,
    error,
    isLoading,
    expandedRows,
    renderExpandedRow,
  } = props;

  return (
    <div className={cn("isolate overflow-hidden rounded-md border", className)}>
      <Table>
        <TableHeader>
          {tableConfig.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({
              length: typeof isLoading === "number" ? isLoading : 4,
            }).map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  className="h-16 px-4"
                  colSpan={tableConfig.getAllColumns().length}
                >
                  <Skeleton className="h-full w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : tableConfig.getRowModel().rows?.length ? (
            tableConfig.getRowModel().rows.map((row) => {
              const isExpanded = expandedRows?.has(row.id);
              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "h-16",
                      onRowClick
                        ? "hover:bg-muted/50 cursor-pointer transition-colors"
                        : "",
                      isExpanded ? "border-b-0" : ""
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && renderExpandedRow && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="px-4 py-3"
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  "columns" in props
                    ? props.columns.length
                    : tableConfig.getAllColumns().length
                }
                className="h-24 text-center"
              >
                {error ? (
                  <div className="text-muted-foreground space-y-2">
                    <p>{error.message || "Something went wrong."}</p>
                  </div>
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
