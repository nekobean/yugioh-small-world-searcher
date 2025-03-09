import React from "react";

import { cn } from "@/lib/utils";
import { isConnected, Monster } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function getMiddleMonsters(monsters: Monster[], endpointMonsters: Monster[]): Monster[] {
  if (endpointMonsters.length < 2) {
    return []; // 最低2枚以上のモンスターが必要
  }

  const middleMonsters = monsters.filter((card) =>
    endpointMonsters.every((x) => isConnected(card, x))
  );

  return middleMonsters;
}

interface MiddleMonsterSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  monsters: Monster[];
  deck: Monster[];
  addMonster: (card_id: number | number[]) => void;
}

const MiddleMonsterSection: React.FC<MiddleMonsterSectionProps> = ({
  className,
  monsters,
  deck,
  addMonster,
}) => {
  const [endpointMonsters, setEndpointMonsters] = React.useState<Monster[]>([]);
  const addMonsterColumns = createColumns(addMonster, "add");
  const middleMonsters = getMiddleMonsters(monsters, endpointMonsters);

  React.useEffect(() => {
    setEndpointMonsters((prev) =>
      prev.filter((monster) => deck.some((deckMonster) => deckMonster.id === monster.id))
    );
  }, [deck]);

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">中継ぎカードの検索</h2>

      <p className="mt-3">
        選択した複数のカードを相互に行き来可能にする中継ぎカードを検索し、デッキに追加できます。
      </p>

      {/* Dropdown Menu */}
      <div className="mt-1 text-black">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              カードを選択
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {deck.map((monsters) => {
              return (
                <DropdownMenuCheckboxItem
                  key={monsters.id}
                  checked={endpointMonsters.find((m) => m.id === monsters.id) !== undefined}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setEndpointMonsters((prev) => [...prev, monsters]);
                    } else {
                      setEndpointMonsters((prev) =>
                        prev.filter((monster) => monster.id !== monsters.id)
                      );
                    }
                  }}
                >
                  {monsters.name}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <DataTable columns={addMonsterColumns} data={middleMonsters} type="middle" className="mt-6" />
    </section>
  );
};

export { MiddleMonsterSection };
