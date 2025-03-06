import { Button } from "@/components/ui/button";
import { Jumbotron } from "@/pages/jumbotron";
import "./App.css";

function App() {
  return (
    <>
      <main className="h-screen w-full bg-gray-200">
        <div className="container mx-auto px-6 py-12">
          <Jumbotron />
        </div>
      </main>
    </>
  );
}

export default App;
