import { formatDistanceToNow, parseISO, isValid, format } from "date-fns";

export function fromNow(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

export function formatShortTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return "—";
    return format(d, "HH:mm:ss");
  } catch {
    return "—";
  }
}
