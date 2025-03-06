import React, { JSX } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { formatCardText, Monster, officialUrl } from "./dataloader";

export function createColumns(
  buttonAction: (card_id: number) => void,
  buttonText: string
): ColumnDef<Monster>[] {
  const columns: ColumnDef<Monster>[] = [
    {
      accessorKey: "name",
      header: "カード名",
      cell: ({ row }) => {
        const url = officialUrl(row.original.id);
        return (
          <a
            href={url}
            className="hover:font-bold text-[#388dca] hover:text-[#879be3] underline"
            target="_blank"
          >
            {row.original.name}
          </a>
        );
      },
    },
    {
      accessorKey: "button",
      header: "",
      cell: ({ row }) => {
        return (
          <Button onClick={() => buttonAction(row.original.id)} size="sm">
            {buttonText}
          </Button>
        );
      },
    },
    {
      accessorKey: "race",
      header: "種族",
    },
    {
      accessorKey: "attr",
      header: "属性",
    },
    {
      accessorKey: "level",
      header: "レベル",
    },
    {
      accessorKey: "atk",
      header: "攻撃力",
    },
    {
      accessorKey: "def",
      header: "防御力",
    },
    {
      accessorKey: "prop",
      header: "種類",
      cell: ({ row }) => {
        return row.original.prop.join(" / ");
      },
    },
    {
      accessorKey: "text",
      header: "テキスト",
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button className="inline-block shadow px-2 py-1 rounded" size="sm">
                  テキスト
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[500px]">
                <p>{formatCardText(row.original.text)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  return columns;
}
