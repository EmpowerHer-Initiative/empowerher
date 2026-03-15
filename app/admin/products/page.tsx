"use client";

import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table";

import { paymentColumns } from "@/app/admin/products/columns";

export default function ProductsPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.payments.getProducts.queryOptions()
  );

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
