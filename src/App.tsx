// import { Button } from "@/components/ui/button";
import { Jumbotron } from "@/pages/jumbotron";
import { Deck } from "@/pages/deck";
import "./App.css";

function App() {
  return (
    <>
      <main className="bg-gray-200 w-full h-screen">
        <div className="mx-auto px-6 py-12 container">
          <Jumbotron />

          <Deck className="mt-6" />
        </div>
      </main>
    </>
  );
}

export default App;
