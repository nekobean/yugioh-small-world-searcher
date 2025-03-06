import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      placeholder="カード名を入力"
      type={type}
      data-slot="input"
      className={cn(
        "border-input-border placeholder:text-muted-foreground text-input-text",
        "border flex h-9 w-full min-w-0 rounded-md bg-input-background px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "selection:bg-primary selection:text-primary-foreground",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
