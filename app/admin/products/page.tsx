"use client";

import { notFound } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { isFeatureEnabled } from "@/config/features";

import { DataTable } from "@/components/data-table";

import { paymentColumns } from "@/app/admin/products/columns";

export default function ProductsPage() {
  if (!isFeatureEnabled("products")) notFound();

  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.products.listAll.queryOptions());

  return (
    <div className="container">
      <h1>Products</h1>
      <DataTable
        columns={paymentColumns}
        data={data || []}
        isLoading={isLoading}
      />
      {/* <CreatePaymentDialog /> */}
    </div>
  );
}
