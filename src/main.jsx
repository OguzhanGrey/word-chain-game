import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import App from "./App";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GameProvider>
      <App />
    </GameProvider>
  </BrowserRouter>
);
