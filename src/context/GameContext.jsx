import React, { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    lastWord: "",
    usedWords: [],
  });

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("highScore", highScore.toString());
  }, [highScore]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      lastWord: "",
      usedWords: [],
    });
  };

  const addWord = (word, points) => {
    setGameState((prevState) => {
      return {
        ...prevState,
        score: prevState.score + points,
        lastWord: word,
        usedWords: [...prevState.usedWords, word],
      };
    });
  };

  const endGame = () => {
    const isNewHighScore = gameState.score > highScore;
    if (isNewHighScore) {
      setHighScore(gameState.score);
    }
    setGameState((prevState) => ({
      ...prevState,
      isPlaying: false,
    }));
    return isNewHighScore;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        highScore,
        startGame,
        addWord,
        endGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
