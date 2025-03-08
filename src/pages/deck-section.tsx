import React from "react";

import { cn } from "@/lib/utils";
import { Monster, postDeck } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";
import { Button } from "@/components/ui/button";

interface DeckSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
  deleteMonster: (card_id: number | number[]) => void;
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

      {/* アクション */}
      <div className="space-y-2 mt-3">
        <div className="flex gap-2">
          <Button onClick={() => deleteMonster(deck.map((monster) => monster.id))}>
            デッキをリセット
          </Button>
          <Button onClick={() => navigator.clipboard.writeText(window.location.href)}>
            デッキの URL をコピー
          </Button>
          <Button onClick={() => postDeck(deck)}>デッキをツイート</Button>
        </div>
        <p className="text-lg">
          URL をブラウザのお気に入りに登録するか、ツイートするなど覚えておくことで、その URL
          にアクセスした際にデッキの状態が復元されます。
        </p>
      </div>
    </section>
  );
};

export { DeckSection };
