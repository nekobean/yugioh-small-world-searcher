import { Jumbotron } from "@/pages/jumbotron";
import { DeckSection } from "@/pages/deck-section";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { getDeckURL, loadMonsterList, Monster } from "@/lib/dataloader";
import { AdvertisementSection } from "@/pages/adsense-section";
import { AddMonsterSection } from "@/pages/add-monster-section";
import { MiddleMonsterSection } from "@/pages/middle-monster-section";
import { ResultGraphSection } from "@/pages/result-graph-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultMatrixSection } from "@/pages/result-matrix-section";
import { ResultTableSection } from "@/pages/result-table-section";

function App() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [deck, setDeck] = useState<Monster[]>([]);
  const navigate = useNavigate();

  function addMonster(card_ids: number | number[]) {
    const cardIds = Array.isArray(card_ids) ? card_ids : [card_ids];

    const newMonsters = cardIds
      .map((card_id) => monsters.find((monster) => monster.id === card_id))
      .filter(
        (monster) => monster !== undefined && !deck.find((m) => m.id === monster!.id)
      ) as Monster[];

    setDeck((prevDeck) => [...prevDeck, ...newMonsters]);
  }

  function deleteMonster(card_ids: number | number[]) {
    const cardIds = Array.isArray(card_ids) ? card_ids : [card_ids];
    const newDeck = deck.filter((monster) => !cardIds.includes(monster.id));

    setDeck(newDeck);
  }

  function parseURL() {
    const params = new URLSearchParams(window.location.search);
    const cardIdsParam = params.get("card_id");
    if (cardIdsParam) {
      const cardIds = cardIdsParam.split(",").map(Number);
      addMonster(cardIds);
    }
  }

  function updateURL(deck: Monster[]) {
    const url = getDeckURL(deck);
    navigate(url);
  }

  useEffect(() => {
    loadMonsterList("/ja_monsters_20250225.json", setMonsters);
  }, []);

  useEffect(() => {
    if (monsters.length > 0) {
      parseURL();
    }
  }, [monsters]);

  useEffect(() => {
    if (monsters.length > 0) {
      updateURL(deck);
    }
  }, [deck]);

  return (
    <>
      <main className="bg-gray-50 w-full min-w-[800px]">
        <div className="mx-auto px-6 py-12 container">
          <Jumbotron />
          <AdvertisementSection className="mt-6" />

          {/* カード追加 */}
          <Tabs
            defaultValue="add-monster"
            className="bg-blue-600 shadow-2xl mt-6 p-8 rounded-2xl text-white"
          >
            <TabsList className="space-x-2">
              <TabsTrigger value="add-monster" className="text-2xl">
                モンスターの追加
              </TabsTrigger>
              <TabsTrigger value="middle-monster" className="text-2xl">
                中継ぎカードの検索
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add-monster">
              <AddMonsterSection monsters={monsters} addMonster={addMonster} />
            </TabsContent>
            <TabsContent value="middle-monster">
              <MiddleMonsterSection
                className="mt-6"
                monsters={monsters}
                deck={deck}
                addMonster={addMonster}
              />
            </TabsContent>
          </Tabs>

          {/* デッキ */}
          <DeckSection className="mt-6" deck={deck} deleteMonster={deleteMonster} />

          {/* カード追加 */}
          <Tabs
            defaultValue="result-table"
            className="bg-blue-600 shadow-2xl mt-6 p-8 rounded-2xl text-white"
          >
            <TabsList className="space-x-2">
              <TabsTrigger value="result-graph" className="text-2xl">
                相関グラフ
              </TabsTrigger>
              <TabsTrigger value="result-matrix" className="text-2xl">
                早見表 (行列)
              </TabsTrigger>
              <TabsTrigger value="result-table" className="text-2xl">
                早見表 (テーブル)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="result-graph">
              <ResultGraphSection deck={deck} />
            </TabsContent>
            <TabsContent value="result-matrix">
              <ResultMatrixSection deck={deck} />
            </TabsContent>
            <TabsContent value="result-table">
              <ResultTableSection deck={deck} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

export default App;
