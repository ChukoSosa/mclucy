import { cn } from "@/lib/utils/cn";
import { statusLabel, statusVariant } from "@/lib/utils/formatStatus";
import type { StatusVariant } from "@/lib/utils/formatStatus";

const variantClasses: Record<StatusVariant, string> = {
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  slate: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const dotClasses: Record<StatusVariant, string> = {
  green: "bg-green-400",
  cyan: "bg-cyan-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  slate: "bg-slate-400",
  purple: "bg-purple-400",
};

interface StatusBadgeProps {
  status: string | null | undefined;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ status, variant, pulse, className }: StatusBadgeProps) {
  const v = variant ?? statusVariant(status);
  const label = statusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider",
        variantClasses[v],
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClasses[v], pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
