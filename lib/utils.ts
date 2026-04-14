import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Better Auth uses a URL-safe alphabet (62 characters)
const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Generates 32-character IDs
export const generateId = customAlphabet(alphabet, 32);

/**
 * Gets the error message from an error object
 * @param error - The error object
 * @returns The error message
 */
type ErrorWithResponse = {
  response?: {
    data?: {
      errors?: Array<string | { message?: string }>;
      error?: { message?: string };
      message?: string;
      detail?: string;
    };
  };
  message?: string;
  detail?: string;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  const err = error as ErrorWithResponse;

  if (Array.isArray(err?.response?.data?.errors)) {
    return err.response.data.errors
      .map((e) => (typeof e === "string" ? e : e?.message || JSON.stringify(e)))
      .join(", ");
  }

  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    err?.detail ||
    "An unknown error occurred"
  );
};
