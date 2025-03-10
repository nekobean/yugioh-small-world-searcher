import React from "react";

import { isConnected, Monster } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
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
    <section>
      <p className="mt-3">
        選択した複数のカードを相互に行き来可能にする中継ぎカードを検索し、デッキに追加できます。
      </p>

      {/* 行き来したいモンスター */}
      <div className="mt-3">
        <Popover>
          <Button className="" variant="outline" asChild>
            <PopoverTrigger className="text-black">行き来したいモンスターを選択</PopoverTrigger>
          </Button>
          <PopoverContent align="start" className="border-6 border-gray-200">
            <div className="space-y-3 mt-1 rounded-md text-black">
              {deck.map((monsters) => {
                return (
                  <div key={monsters.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${monsters.id}`}
                      className="bg-white border-2 border-black"
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
                    />
                    <label
                      htmlFor={`checkbox-${monsters.id}`}
                      className="text-md leading-none select-none"
                    >
                      {monsters.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <DataTable columns={addMonsterColumns} data={middleMonsters} type="middle" className="mt-6" />
    </section>
  );
};

export { MiddleMonsterSection };
