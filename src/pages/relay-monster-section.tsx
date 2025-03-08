import React from "react";

import { cn } from "@/lib/utils";
import { Monster } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";

interface RelayMonsterSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  monsters: Monster[];
  addMonster: (card_id: number | number[]) => void;
}

const RelayMonsterSection: React.FC<RelayMonsterSectionProps> = ({
  className,
  monsters,
  addMonster,
}) => {
  const addMonsterColumns = createColumns(addMonster, "add");

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">中継ぎカードの検索</h2>

      <p className="mt-3">
        チェックボックスで選択したカードを相互に行き来可能にする中継ぎカードを検索し、デッキに追加できます。
      </p>

      <DataTable columns={addMonsterColumns} data={monsters} type="relay" className="mt-6" />
    </section>
  );
};

export { RelayMonsterSection };
