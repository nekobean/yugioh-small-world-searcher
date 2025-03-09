import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/monsters/pagenation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  type: "add" | "deck" | "relay";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  type,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: type == "deck" ? 100 : 10,
      },
    },
  });

  return (
    <div className={className}>
      {/* Filtering */}
      {type !== "deck" && (
        <div>
          <label htmlFor="card-search" className="text-sm">
            {type === "add"
              ? "モンスター名を入力（読み仮名でも可）"
              : "カード名、種族、属性、種類などのキーワードを入力 (空白区切りで複数指定可)"}
          </label>
          <div className="relative max-w-sm">
            <Input
              id="card-search"
              placeholder={
                type === "add" ? "例: とらいぶりげーと" : "例: 光属性 ドラゴン チューナー"
              }
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              className="bg-white mt-1 w-full text-black"
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="top-1/2 right-1 absolute size-8 text-gray-500 hover:text-gray-900 -translate-y-1/2"
              onClick={() => {
                table.getColumn("name")?.setFilterValue("");
              }}
            >
              <span className="sr-only">クリア</span>
              <X />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white mt-3 p-2 border rounded-md text-black">
        <Table>
          {/* Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  該当なし
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {type !== "deck" && <DataTablePagination table={table} className="mt-3" />}
    </div>
  );
}
