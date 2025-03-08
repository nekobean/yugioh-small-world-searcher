import React from "react";

import { cn } from "@/lib/utils";
import { Monster } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";

interface DeckSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
  deleteMonster: (card_id: number) => void;
}

const DeckSection: React.FC<DeckSectionProps> = ({ className, deck, deleteMonster }) => {
  const deleteMonsterColumns = createColumns(deleteMonster, "deck");

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">デッキ</h2>

      <DataTable columns={deleteMonsterColumns} data={deck} className="mt-3" type="deck" />
    </section>
  );
};

export { DeckSection };
