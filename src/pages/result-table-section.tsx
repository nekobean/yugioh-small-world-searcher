import React from "react";

import { getSearchPatterns, Monster, SearchPath } from "@/lib/dataloader";
import { SearchPathDataTable } from "@/components/paths/data-table";
import { pathColumns } from "@/components/paths/columns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface MonsterFilterProps {
  deck: Monster[];
  selectedMonsters: Monster[];
  setSelectedMonsters: React.Dispatch<React.SetStateAction<Monster[]>>;
  label: string;
  checkboxIdPrefix: string;
}

const MonsterFilter: React.FC<MonsterFilterProps> = ({
  deck,
  selectedMonsters,
  setSelectedMonsters,
  label,
  checkboxIdPrefix,
}) => {
  return (
    <div className="space-y-3 mt-1 px-6 rounded-md w-1/3 text-black">
      <div>{label}</div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${checkboxIdPrefix}-select-all`}
          className="bg-white border-2 border-black"
          checked={
            selectedMonsters.length === deck.length ||
            (selectedMonsters.length > 0 && "indeterminate")
          }
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedMonsters(deck);
            } else {
              setSelectedMonsters([]);
            }
          }}
        />
        <label
          htmlFor={`${checkboxIdPrefix}-select-all`}
          className="text-md leading-none select-none"
        >
          すべて
        </label>
      </div>
      {deck.map((monster) => (
        <div key={monster.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${checkboxIdPrefix}-${monster.id}`}
            className="bg-white border-2 border-black"
            checked={selectedMonsters.some((m) => m.id === monster.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedMonsters((prev) => [...prev, monster]);
              } else {
                setSelectedMonsters((prev) => prev.filter((m) => m.id !== monster.id));
              }
            }}
          />
          <label
            htmlFor={`${checkboxIdPrefix}-${monster.id}`}
            className="text-md leading-none select-none"
          >
            {monster.name}
          </label>
        </div>
      ))}
    </div>
  );
};

interface ResultTableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
  searchPaths: SearchPath[];
}

const ResultTableSection: React.FC<ResultTableSectionProps> = ({ deck, searchPaths }) => {
  const [sourceMonsters, setSourceMonsters] = React.useState<Monster[]>([]);
  const [middleMonsters, setMiddleMonsters] = React.useState<Monster[]>([]);
  const [targetMonsters, setTargetMonsters] = React.useState<Monster[]>([]);

  React.useEffect(() => {
    setSourceMonsters(deck);
    setMiddleMonsters(deck);
    setTargetMonsters(deck);
  }, [deck]);

  const filteredSearchPaths = searchPaths
    .map((path) => ({
      ...path,
      middles: path.middles.filter((middle) =>
        middleMonsters.some((monster) => monster.id === middle.id)
      ),
    }))
    .filter((path) => {
      if (!sourceMonsters.some((monster) => monster.id === path.source.id)) {
        return false;
      }

      if (!targetMonsters.some((monster) => monster.id === path.target.id)) {
        return false;
      }

      return path.middles.length > 0;
    });

  return (
    <section>
      <ul className="mt-3 text-lg list-disc list-inside">
        <li>サーチパターンを限定したい場合は、チェックを外してください。</li>
        <li>テーブルのカラムをクリックすると、ソートできます。</li>
      </ul>

      {/* フィルタ */}
      <div className="mt-3">
        <Popover>
          <Button className="" variant="outline" asChild>
            <PopoverTrigger className="text-black">モンスターを限定する</PopoverTrigger>
          </Button>
          <PopoverContent
            align="start"
            className="flex justify-between border-6 border-gray-200 divide-x w-fit"
          >
            <MonsterFilter
              deck={deck}
              selectedMonsters={sourceMonsters}
              setSelectedMonsters={setSourceMonsters}
              label="サーチ元"
              checkboxIdPrefix="checkbox-source"
            />
            <MonsterFilter
              deck={deck}
              selectedMonsters={middleMonsters}
              setSelectedMonsters={setMiddleMonsters}
              label="中継ぎ"
              checkboxIdPrefix="checkbox-middle"
            />
            <MonsterFilter
              deck={deck}
              selectedMonsters={targetMonsters}
              setSelectedMonsters={setTargetMonsters}
              label="サーチ先"
              checkboxIdPrefix="checkbox-target"
            />
          </PopoverContent>
        </Popover>
      </div>

      <SearchPathDataTable columns={pathColumns} data={filteredSearchPaths} className="mt-3" />
    </section>
  );
};

export { ResultTableSection };
