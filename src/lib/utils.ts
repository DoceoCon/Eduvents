import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { format, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeFormatDate(date: string | Date | undefined | null, formatStr: string): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (!isValid(dateObj)) return "";
  try {
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function safeConvertTo12Hour(time24: string | undefined | null): string {
  if (!time24 || typeof time24 !== "string" || !time24.includes(":")) return "";
  try {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    if (isNaN(hour) || isNaN(parseInt(minutes, 10))) return "";
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return "";
  }
}
