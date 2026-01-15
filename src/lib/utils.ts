import { type ClassValue, clsx } from "clsx";
import { sql, type AnyColumn } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function incr(col: AnyColumn, amount: number = 1) {
  return sql`${col} + ${amount}`;
}
