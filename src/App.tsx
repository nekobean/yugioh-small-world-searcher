// import { Button } from "@/components/ui/button";
import { Jumbotron } from "@/pages/jumbotron";
import { Deck } from "@/pages/deck";
import "./App.css";
import { useEffect, useState } from "react";
import { loadMonsterList, Monster } from "@/lib/dataloader";

function App() {
  const [monsters, setMonsters] = useState<Monster[]>([]);

  useEffect(() => {
    loadMonsterList("/ja_monsters_20250225.json", setMonsters);
  }, []);

  return (
    <>
      <main className="bg-gray-50 w-full h-screen">
        <div className="mx-auto px-6 py-12 container">
          <Jumbotron />
          <Deck className="mt-6" monsters={monsters} />
        </div>
      </main>
    </>
  );
}

export default App;
