// import { Button } from "@/components/ui/button";
import { Jumbotron } from "@/pages/jumbotron";
import { DeckSection } from "@/pages/deck-section";
import "./App.css";
import { useEffect, useState } from "react";
import { loadMonsterList, Monster } from "@/lib/dataloader";
import { AdvertisementSection } from "./pages/adsense-section";
import { AddMonsterSection } from "./pages/add-monster-section";

function App() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [deck, setDeck] = useState<Monster[]>([]);

  function addMonster(card_id: number) {
    const monster = monsters.find((monster) => monster.id === card_id);
    if (monster === undefined) {
      return;
    }

    if (deck.find((monster) => monster.id === card_id)) {
      return; // すでに登録済みの場合は追加しない
    }

    setDeck([...deck, monster]);
  }

  function deleteMonster(card_id: number) {
    setDeck(deck.filter((monster) => monster.id !== card_id));
  }

  useEffect(() => {
    loadMonsterList("/ja_monsters_20250225.json", setMonsters);
  }, []);

  return (
    <>
      <main className="bg-gray-50 w-full h-screen">
        <div className="mx-auto px-6 py-12 container">
          <Jumbotron />
          <AdvertisementSection className="mt-6" />
          <AddMonsterSection className="mt-6" monsters={monsters} addMonster={addMonster} />
          <DeckSection className="mt-6" deck={deck} deleteMonster={deleteMonster} />
        </div>
      </main>
    </>
  );
}

export default App;
