import "./App.css";
import { useState } from "react";
import type { Node } from "./components/graph";
import { GraphCanvas } from "./components/GraphCanvas";

function App() {
  const [nodes] = useState<Node[]>([
    { id: "A", x: 100, y: 100 },
    { id: "B", x: 300, y: 100 },
    { id: "C", x: 200, y: 300 },
  ]);

  return (
    <>
      <h1>Shortest Path Algorithm</h1>
      <GraphCanvas nodes={nodes} />
    </>
  );
}

export default App;
