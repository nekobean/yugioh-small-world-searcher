import React from "react";

import { cn } from "@/lib/utils";
import { Monster } from "@/lib/dataloader";
import { DataTable } from "@/components/monsters/data-table";
import { createColumns } from "@/components/monsters/columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AddMonsterSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  monsters: Monster[];
  addMonster: (card_id: number) => void;
}

const AddMonsterSection: React.FC<AddMonsterSectionProps> = ({
  className,
  monsters,
  addMonster,
}) => {
  const [shortcutMonsters, setShortcutMonsters] = React.useState<Monster[]>([]);
  const addMonsterColumns = createColumns(addMonster, "add");
  const shortcutMonsterIds = [
    12950, 11708, 13587, 9278, 9279, 6980, 14741, 12067, 12070, 8933, 9455, 20206, 20500, 20764,
  ];

  React.useEffect(() => {
    const filteredMonsters = shortcutMonsterIds
      .map((id) => monsters.find((monster) => monster.id === id))
      .filter((monster) => monster !== undefined);
    setShortcutMonsters(filteredMonsters);
  }, [monsters]);

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">モンスターの追加</h2>

      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          カード名を入力すると、候補が表示されます。「追加」ボタンをクリックして、デッキに追加してください。（例:
          "鉄獣"、"とらいぶりげーど"）
        </li>
        <li>OCG 未実装のカードは英語名で検索してください。（例: "ゴーティス"なら"ghoti"）</li>
        <li>
          見つからないカードがある場合は、お手数ですが
          <a
            href="https://pystyle.info/yugioh-small-world-searcher/#respond"
            target="_blank"
            className="link"
          >
            コメント欄
          </a>
          で教えていただければ、アップデートします。
        </li>
      </ul>

      <DataTable columns={addMonsterColumns} data={monsters} type="add" className="mt-6" />

      <div className="mt-6">
        <span className="text-sm">汎用モンスター（クリックすると、追加されます）</span>
        <div className="flex flex-wrap gap-4 mt-1">
          {shortcutMonsters.map((monster) => (
            <Avatar
              key={monster.id}
              className="shadow-black hover:shadow-md hover:scale-120 transition-transform duration-100"
              onClick={() => addMonster(monster.id)}
            >
              <AvatarImage src={`/images/${monster.id}.jpg`} alt={monster.name} />
              <AvatarFallback>{monster.name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </section>
  );
};

export { AddMonsterSection };
