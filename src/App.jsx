import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Layout>
    </GameProvider>
  );
}

export default App;
