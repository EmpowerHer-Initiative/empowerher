"use client";

import { useMemo, useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DataTable } from "@/components/data-table";
import { usePeriod } from "@/components/staff/period-context";

import { columns } from "./columns";
import { StudentsForm } from "./students-form";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const { period } = usePeriod();
  const trpc = useTRPC();
  const {
    data: students,
    isPending,
    error,
  } = useQuery(trpc.staff.students.list.queryOptions({ period }));

  const filtered = useMemo(() => {
    if (!students) return [];
    if (!search) return students;
    const query = search.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
    );
  }, [students, search]);

  return (
    <div className="container">
      <h1>Accepted Students — Period {period}</h1>
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
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <Plus /> Add Student
        </Button>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={filtered}
        error={error}
      />
      <StudentsForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
