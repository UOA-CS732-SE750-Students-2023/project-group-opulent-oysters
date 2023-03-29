import { useState } from "react";
import "./App.css";
import { LandingPage } from "./pages/LandingPage/LandingPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <LandingPage></LandingPage>
    </div>
  );
}

export default App;
