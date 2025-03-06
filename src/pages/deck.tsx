import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Monster, searchMonsters } from "@/lib/dataloader";
import { DataTable } from "@/lib/data-table";
import { createColumns } from "@/lib/columns";

interface DeckProps {
  className?: string;
  monsters: Monster[];
}

const Deck: React.FC<DeckProps> = ({ className, monsters }) => {
  const [keywords, setKeywords] = useState<string>("");
  const [candidates, setCandidates] = useState<Monster[]>([]);
  const addMonsterColumns = createColumns(addMonster, "追加");

  useEffect(() => {
    const candidates = searchMonsters(monsters, keywords);
    setCandidates(candidates);
  }, [keywords]);

  useEffect(() => {
    const candidates = searchMonsters(monsters, "ブルーアイズ");
    setCandidates(candidates);
  }, [monsters]);

  function addMonster(card_id: number) {}

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-10 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">デッキ入力</h2>

      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          カード名の一部を入力すると、候補が表示されます。「追加」ボタンをクリックして、デッキに追加してください。（例:
          "鉄獣"、"とらいぶりげーど"）
        </li>
        <li>
          OCG 未実装のカードは英語名で検索してください。（例: "ゴーティス"なら"ghoti"）
        </li>
        <li>
          検索しても見つからないカードがある場合、こちらの
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

      <div className="mt-6">
        <label htmlFor="card-search" className="block text-sm">
          モンスター名を入力（読み仮名でも可）
        </label>
        <Input
          id="card-search"
          className="block mt-1 w-full md:w-[500px]"
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      {keywords.length > 0 && (
        <div className="z-30">
          <DataTable
            columns={addMonsterColumns}
            data={candidates}
            pageSize={15}
            className="mt-6"
          />
        </div>
      )}
    </section>
  );
};

export { Deck };
