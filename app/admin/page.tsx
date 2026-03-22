"use client";

import { AdminOverview } from "@/components/admin/overview";

export default function AdminPage() {
  return (
    <div className="container space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-sm">Admin</p>
          <h1 className="mb-0!">Overview</h1>
        </div>
        <p className="text-muted-foreground pb-1 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <AdminOverview />
    </div>
  );
}
