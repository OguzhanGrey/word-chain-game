import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { startGame } = useGame();

  const handleStartGame = () => {
    startGame();
    navigate("/game");
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Word Chain</h1>
        <p className="hero-subtitle">
          Improve your English vocabulary with the Word Chain game and have a
          fun time. Each word must start with the last letter of the previous
          word!
        </p>
        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Improve Your English Vocabulary</h3>
          <p className="feature-description">
            Improve your English vocabulary with the Word Chain game and have a
            fun time.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3 className="feature-title">Quick Thinking</h3>
          <p className="feature-description">
            Try to find the correct word within the time limit.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3 className="feature-title">Record Breaking</h3>
          <p className="feature-description">Try to get the highest score.</p>
        </div>
      </div>

      <div className="how-to-play">
        <h2 className="how-to-play-title">How to Play?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p className="step-description">Enter a word and start the game.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p className="step-description">
              The next word must start with the last letter of the previous
              word.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p className="step-description">
              Enter a new word before the time runs out.
            </p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <p className="step-description">Try to get the highest score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
