import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { validateWord } from "../../utils/wordValidator";
import "./Game.css";

const Game = () => {
  const navigate = useNavigate();
  const { gameState, highScore, addWord, endGame } = useGame();
  const [inputWord, setInputWord] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [lastPoints, setLastPoints] = useState(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [totalWordTime, setTotalWordTime] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!gameState.isPlaying) {
      setIsGameOver(true);
    }
  }, [gameState.isPlaying]);

  useEffect(() => {
    let timer;
    if (isTimerStarted && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isGameOver) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isTimerStarted]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
      setWordStartTime(Date.now());
    }
  }, [isLoading]);

  const checkWordRules = (word) => {
    if (!word) return "Please enter a word.";
    if (word.length < 3) return "The word must be at least 3 characters long.";
    if (!/^[a-zA-Z]+$/.test(word)) return "Only English letters can be used.";
    if (gameState.usedWords.includes(word.toLowerCase()))
      return "This word has already been used.";
    if (
      gameState.lastWord &&
      word[0].toLowerCase() !==
        gameState.lastWord[gameState.lastWord.length - 1].toLowerCase()
    ) {
      return `The word '${gameState.lastWord[
        gameState.lastWord.length - 1
      ].toUpperCase()}' must start with the letter '${gameState.lastWord[
        gameState.lastWord.length - 1
      ].toUpperCase()}'.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const word = inputWord.trim();

    const basicError = checkWordRules(word);
    if (basicError) {
      setMessage(basicError);
      setLastPoints(null);
      return;
    }

    setIsLoading(true);
    try {
      const validationResult = await validateWord(word);
      if (!validationResult.isValid) {
        setMessage(validationResult.message);
        setLastPoints(null);
        return;
      }

      if (wordStartTime) {
        const timeSpent = (Date.now() - wordStartTime) / 1000; 
        setTotalWordTime(prev => prev + timeSpent);
      }

      addWord(word.toLowerCase(), validationResult.points);
      setInputWord("");
      setMessage(validationResult.message);
      setLastPoints(validationResult);
      setTimeLeft(15);

      if (!isTimerStarted) {
        setIsTimerStarted(true);
      }
    } catch (error) {
      setMessage("An error occurred while checking the word.");
      setLastPoints(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = () => {
    const isNewHigh = endGame();
    setIsNewHighScore(isNewHigh);
    setIsGameOver(true);
  };

  const getLongestWord = () => {
    if (gameState.usedWords.length === 0) return "";
    return gameState.usedWords.reduce((longest, current) =>
      current.length > longest.length ? current : longest
    );
  };

  const getTotalWordLength = () => {
    return gameState.usedWords.reduce((total, word) => total + word.length, 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handlePlayAgain = () => {
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isGameOver) {
    const longestWord = getLongestWord();
    const totalWordLength = getTotalWordLength();

    if (isNewHighScore) {
      return (
        <div className="game-over-container">
          <div className="game-over-content win-screen">
            <div className="win-message">
              <i className="fas fa-trophy"></i>
              <h2>Congratulations!</h2>
              <p>You've set a new high score!</p>
              <div className="score-display">
                <span className="score-label">New High Score:</span>
                <span className="score-value">{gameState.score}</span>
              </div>
            </div>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Words</h3>
                <p>{gameState.usedWords.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Score</h3>
                <p>{gameState.score}</p>
              </div>
              <div className="stat-card">
                <h3>Total Time Spent</h3>
                <p>{formatTime(totalWordTime)}</p>
              </div>
              <div className="stat-card">
                <h3>Average Time per Word</h3>
                <p>{formatTime(totalWordTime / gameState.usedWords.length)}</p>
              </div>
              <div className="stat-card">
                <h3>Total Word Length</h3>
                <p>{totalWordLength} letters</p>
              </div>
              <div className="stat-card">
                <h3>Longest Word</h3>
                <p>
                  {longestWord} ({longestWord.length} letters)
                </p>
              </div>
            </div>
            <div className="words-list">
              <h3>Used Words</h3>
              <div className="words-grid">
                {gameState.usedWords.map((word, index) => (
                  <span
                    key={index}
                    className={`word-pill ${
                      word === longestWord ? "longest-word" : ""
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <div className="game-over-buttons">
              <button className="play-again-button" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button className="home-button" onClick={handleBackToHome}>
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="game-over-container">
        <div className="game-over-content">
          <h2 className="game-over-title">Game Over!</h2>
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Words</h3>
              <p>{gameState.usedWords.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Score</h3>
              <p>{gameState.score}</p>
            </div>
            <div className="stat-card">
              <h3>Total Time Spent</h3>
              <p>{formatTime(totalWordTime)}</p>
            </div>
            <div className="stat-card">
              <h3>Average Time per Word</h3>
              <p>{formatTime(totalWordTime / gameState.usedWords.length)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Word Length</h3>
              <p>{totalWordLength} letters</p>
            </div>
            <div className="stat-card">
              <h3>Highest Score</h3>
              <p>{highScore}</p>
            </div>
            <div className="stat-card">
              <h3>Longest Word</h3>
              <p>
                {longestWord} ({longestWord.length} letters)
              </p>
            </div>
          </div>
          <div className="words-list">
            <h3>Used Words</h3>
            <div className="words-grid">
              {gameState.usedWords.map((word, index) => (
                <span
                  key={index}
                  className={`word-pill ${
                    word === longestWord ? "longest-word" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div className="game-over-buttons">
            <button className="play-again-button" onClick={handlePlayAgain}>
              Play Again
            </button>
            <button className="home-button" onClick={handleBackToHome}>
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <span className="score">Score: {gameState.score}</span>
          <span className="high-score">Highest: {highScore}</span>
          <span className={`time ${timeLeft <= 5 ? "time-warning" : ""}`}>
            Time: {isTimerStarted ? `${timeLeft}s` : "Not Started"}
          </span>
        </div>
        <button className="end-game-button" onClick={handleGameOver}>
          End Game
        </button>
      </div>

      <div className="game-content">
        <div className="last-word">
          {gameState.lastWord ? (
            <>
              <span className="last-word-label">Last Word:</span>
              <span className="last-word-text">{gameState.lastWord}</span>
            </>
          ) : (
            <span className="start-message">Enter the first word!</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="word-form">
          <input
            ref={inputRef}
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Enter a word..."
            className="word-input"
            autoFocus
            disabled={isLoading}
          />
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Checking..." : "Submit"}
          </button>
        </form>

        {message && (
          <div className={`message ${lastPoints ? "success" : "error"}`}>
            {message}
            {lastPoints && (
              <div className="points-info">
                <span>+{lastPoints.points} points</span>
                {lastPoints.extraPoints > 0 && (
                  <span className="extra-points">
                    (+{lastPoints.extraPoints} extra points)
                  </span>
                )}
              </div>
            )}
            {gameState.lastWord && (
              <div className="next-letter-info">
                Next word must start with{" "}
                <span className="next-letter">
                  '
                  {gameState.lastWord[
                    gameState.lastWord.length - 1
                  ].toUpperCase()}
                  '
                </span>
              </div>
            )}
          </div>
        )}

        <div className="used-words">
          <h3>Used Words</h3>
          <div className="words-grid">
            {gameState.usedWords.map((word, index) => (
              <span key={index} className="word-pill">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
