import { Jumbotron } from "@/pages/jumbotron";
import { DeckSection } from "@/pages/deck-section";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { getDeckURL, loadMonsterList, Monster } from "@/lib/dataloader";
import { AdvertisementSection } from "./pages/adsense-section";
import { AddMonsterSection } from "./pages/add-monster-section";
import { RelayMonsterSection } from "./pages/relay-monster-section";
import { ResultGraphSection } from "./pages/result-graph-section";

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
          <AddMonsterSection className="mt-6" monsters={monsters} addMonster={addMonster} />
          <DeckSection className="mt-6" deck={deck} deleteMonster={deleteMonster} />
          <RelayMonsterSection className="mt-6" monsters={monsters} addMonster={addMonster} />
          <ResultGraphSection className="mt-6" deck={deck} />
        </div>
      </main>
    </>
  );
}

export default App;
