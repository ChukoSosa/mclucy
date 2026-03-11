import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  titleRight?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Card({ title, titleRight, className, bodyClassName, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-900 border border-surface-700 rounded-lg overflow-hidden flex flex-col",
        className,
      )}
    >
      {(title || titleRight) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-700 shrink-0">
          {title && (
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {title}
            </h3>
          )}
          {titleRight && <div className="ml-auto">{titleRight}</div>}
        </div>
      )}
      <div className={cn("p-4 overflow-auto", bodyClassName)}>{children}</div>
    </div>
  );
}
