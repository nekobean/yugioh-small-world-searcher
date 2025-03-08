import { ColumnDef } from "@tanstack/react-table";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { formatCardText, Monster, officialUrl, sanitizeString } from "@/lib/dataloader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/monsters/column-header";

export function createColumns(
  buttonAction: (card_id: number) => void,
  type: "add" | "deck"
): ColumnDef<Monster>[] {
  let columns: ColumnDef<Monster>[] = [];

  if (type === "deck") {
    columns.push({
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={`/images/${row.original.id}.jpg`} alt={row.original.name} />
            <AvatarFallback className="bg-gray-300 rounded-md size-12"></AvatarFallback>
          </Avatar>
        );
      },
    });
  }

  columns.push({
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="カード名" />,
    cell: ({ row }) => {
      const url = officialUrl(row.original.id);
      return (
        <a
          href={url}
          className="hover:font-bold text-[#388dca] hover:text-[#879be3] underline"
          target="_blank"
        >
          {row.original.name !== row.original.ruby ? (
            <ruby>
              {row.original.name}
              <rt className="text-[10px]">{row.original.ruby}</rt>
            </ruby>
          ) : (
            row.original.name
          )}
        </a>
      );
    },
    filterFn: (row, _, filterValue) => {
      const keywords = filterValue.split(" ").map(sanitizeString).filter(Boolean);

      return keywords.every(
        (keyword: string) =>
          row.original.sanitizedName.includes(keyword) ||
          row.original.sanitizedRuby.includes(keyword)
      );
    },
  });

  if (type === "add") {
    columns.push({
      accessorKey: "button",
      header: "",
      cell: ({ row }) => {
        return (
          <Button onClick={() => buttonAction(row.original.id)} size="sm">
            追加
          </Button>
        );
      },
    });
  } else {
    columns.push({
      accessorKey: "button",
      header: "",
      cell: ({ row }) => {
        return (
          <Button onClick={() => buttonAction(row.original.id)} size="sm">
            削除
          </Button>
        );
      },
    });
  }

  columns.push(
    {
      accessorKey: "race",
      header: ({ column }) => <DataTableColumnHeader column={column} title="種族" />,
    },
    {
      accessorKey: "attr",
      header: ({ column }) => <DataTableColumnHeader column={column} title="属性" />,
    },
    {
      accessorKey: "level",
      header: ({ column }) => <DataTableColumnHeader column={column} title="レベル" />,
    },
    {
      accessorKey: "atk",
      header: ({ column }) => <DataTableColumnHeader column={column} title="攻撃力" />,
    },
    {
      accessorKey: "def",
      header: ({ column }) => <DataTableColumnHeader column={column} title="防御力" />,
    },
    {
      accessorKey: "prop",
      header: ({ column }) => <DataTableColumnHeader column={column} title="種類" />,
      cell: ({ row }) => {
        return row.original.prop.join("/");
      },
    },
    {
      accessorKey: "text",
      header: "",
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="bg-gray-300 p-1 border border-gray-400 rounded-md">
                テキスト
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-sm" side="left">
                {formatCardText(row.original.text)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    }
  );

  return columns;
}
