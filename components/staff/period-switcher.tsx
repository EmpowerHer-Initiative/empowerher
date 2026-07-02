"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIODS, usePeriod } from "@/components/staff/period-context";

export const PeriodSwitcher = () => {
  const { period, setPeriod } = usePeriod();

  return (
    <div className="bg-background fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 shadow-lg">
      <span className="text-muted-foreground text-sm font-medium">Period</span>
      <Select
        value={String(period)}
        onValueChange={(value) => setPeriod(Number(value))}
      >
        <SelectTrigger className="w-36 text-base font-semibold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((item) => (
            <SelectItem key={item} value={String(item)}>
              Period {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
