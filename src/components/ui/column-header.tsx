import { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue> extends React.ComponentProps<typeof Button> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      className={cn("hover:bg-transparent p-0", className)}
      variant="ghost"
      onClick={() => column.toggleSorting()}
    >
      {title}
      <div className="flex flex-col items-center">
        <ChevronUp
          className={cn("size-3", column.getIsSorted() === "asc" ? "text-black" : "text-gray-400")}
        />
        <ChevronDown
          className={cn("size-3", column.getIsSorted() === "desc" ? "text-black" : "text-gray-400")}
        />
      </div>
    </Button>
  );
}
