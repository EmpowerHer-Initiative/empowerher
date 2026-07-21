const STORAGE_KEY = "staff-approval-due-date";

/** Midnight-normalized today, used to disable past dates in the picker. */
export const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

/** Last-used approval due date, ignored if it has fallen in the past. */
export const getStoredDueDate = (): Date | undefined => {
  if (typeof window === "undefined") return undefined;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;
  const date = new Date(`${stored}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date < startOfToday()) return undefined;
  return date;
};

export const setStoredDueDate = (date: Date) => {
  if (typeof window === "undefined") return;
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  localStorage.setItem(STORAGE_KEY, iso);
};
