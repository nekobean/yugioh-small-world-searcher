import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface DataTablePaginationProps<TData> extends React.HTMLAttributes<HTMLButtonElement> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const currLastRow = Math.min(
    (pageIndex + 1) * table.getState().pagination.pageSize,
    table.getRowCount()
  );

  return (
    <div className={cn("flex justify-between items-center", className)}>
      {/* ページ数 */}
      <div className="font-medium text-sm">
        {currLastRow}件 / {table.getRowCount()}件
      </div>

      <div className="flex items-center space-x-3">
        {/* 表示行数 */}
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">表示件数</p>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="bg-white h-8 text-black">
              <SelectValue>{table.getState().pagination.pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ページ遷移ボタン */}
        <div className="flex bg-white border rounded-md [&_button]:rounded-none divide-x [&_button]:w-9 text-black">
          {/* 最初へ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={table.firstPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">最初へ</span>
            <ChevronsLeft />
          </Button>
          {/* 前へ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">前へ</span>
            <ChevronLeft />
          </Button>
          {/* 前後2ページ分のボタン */}
          {Array.from({ length: table.getPageCount() }, (_, i) => i)
            .filter(
              (pageIndex) =>
                pageIndex >= table.getState().pagination.pageIndex - 2 &&
                pageIndex <= table.getState().pagination.pageIndex + 2
            )
            .map((pageIndex) => (
              <Button
                key={pageIndex}
                variant="ghost"
                size="sm"
                className={cn(
                  "disabled:opacity-100",
                  table.getState().pagination.pageIndex === pageIndex && "bg-gray-300"
                )}
                onClick={() => table.setPageIndex(pageIndex)}
                disabled={table.getState().pagination.pageIndex === pageIndex}
              >
                {pageIndex + 1}
              </Button>
            ))}
          {/* 次へ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">次へ</span>
            <ChevronRight />
          </Button>
          {/* 最後へ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={table.lastPage}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">最後へ</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
