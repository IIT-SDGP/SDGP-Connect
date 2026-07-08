"use client";

import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdminSearchFieldProps = Omit<ComponentProps<typeof Input>, "className"> & {
  className?: string;
  /** Extra classes on the outer flex row (width, alignment). */
  rowClassName?: string;
  onClear?: () => void;
  showClear?: boolean;
};

export function AdminSearchField({
  className,
  rowClassName,
  onClear,
  showClear = false,
  value,
  ...props
}: AdminSearchFieldProps) {
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <div
      className={cn(
        "flex w-full max-w-md items-center justify-center gap-2",
        rowClassName
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input className={cn("h-10 pl-9", className)} value={value} {...props} />
      </div>
      {showClear && hasValue && onClear ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={onClear}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
