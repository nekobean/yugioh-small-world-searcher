import { ColumnDef } from "@tanstack/react-table";

import { SearchPath } from "@/lib/dataloader";
import { DataTableColumnHeader } from "@/components/ui/column-header";

export const pathColumns: ColumnDef<SearchPath>[] = [
  {
    accessorKey: "source.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="サーチ元" />,
  },
  {
    accessorKey: "middle",
    header: "中継ぎ",
    cell: ({ row }) => {
      return (
        <ul>
          {row.original.middles.map((monster, index) => (
            <li key={index}>{monster.name}</li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "target.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="サーチ先" />,
  },
];
