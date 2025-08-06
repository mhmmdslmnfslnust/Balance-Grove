// endlessMode.js
// Endless mode page with increasing difficulty
import React, { useState, useEffect } from 'react';
import { useGame } from '../utils/GameContext';
import TreeCanvas from '../components/TreeCanvas';
import ControlPanel from '../components/ControlPanel';

export default function EndlessMode() {
  const {
    treeStructure,
    balanceFactor,
    plantTree,
    pruneTree,
    resetTree
  } = useGame();

  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('balanceGroveHighScore') || '0');
  });

  // Game timer
  useEffect(() => {
    let interval;
    if (gameActive && !gameOver) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameOver]);

  // Auto-plant trees based on difficulty
  useEffect(() => {
    let interval;
    if (gameActive && !gameOver) {
      const plantInterval = Math.max(3000 - difficulty * 200, 800);
      interval = setInterval(() => {
        plantTree();
        setDifficulty(d => d + 0.1);
      }, plantInterval);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameOver, difficulty, plantTree]);

  // Check game over condition
  useEffect(() => {
    if (balanceFactor > 3 && gameActive) {
      setGameOver(true);
      setGameActive(false);
      
      // Update high score
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('balanceGroveHighScore', score.toString());
      }
    }
  }, [balanceFactor, gameActive, score, highScore]);

  // Update score based on balance
  useEffect(() => {
    if (gameActive && !gameOver) {
      if (balanceFactor <= 1) {
        setScore(s => s + Math.floor(difficulty * 10));
      }
    }
  }, [time, balanceFactor, gameActive, gameOver, difficulty]);

  const startGame = () => {
    resetTree();
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setTime(0);
    setDifficulty(1);
    setSelectedAction(null);
    
    // Plant initial trees
    [20, 10, 30].forEach(value => plantTree(value));
  };

  const handleAction = (action) => {
    if (!gameActive || gameOver) {
      if (action === 'reset') {
        startGame();
      }
      return;
    }

    if (action === 'plant') {
      setSelectedAction('plant');
    } else if (action === 'prune') {
      setSelectedAction('prune');
    } else if (action === 'inspect') {
      alert(`Endless Grove Status:\nScore: ${score}\nTime: ${time}s\nDifficulty: ${difficulty.toFixed(1)}\nBalance Factor: ${balanceFactor}`);
    }
  };

  const handleTreeClick = (value) => {
    if (!gameActive || gameOver) return;

    if (selectedAction === 'plant') {
      plantTree();
      setSelectedAction(null);
      setScore(s => s + 5); // Bonus for manual planting
    } else if (selectedAction === 'prune' && value) {
      pruneTree(value);
      setSelectedAction(null);
      setScore(s => s + Math.floor(difficulty * 15)); // Bigger bonus for strategic pruning
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <ControlPanel 
        mode="Endless" 
        balanceFactor={balanceFactor}
        onAction={handleAction}
        gameStats={{
          score,
          time: formatTime(time),
          difficulty
        }}
      />
      
      <main className="main-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2>♾️ Endless Grove Challenge</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Keep the grove balanced as nature grows wilder! How long can you maintain harmony?
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            alignItems: 'center',
            marginBottom: '1rem' 
          }}>
            <div><strong>High Score:</strong> {highScore}</div>
            {gameActive && (
              <div style={{ color: difficulty > 3 ? '#ff6b6b' : '#6b8e23' }}>
                <strong>Auto-plant every {Math.max(3 - Math.floor(difficulty * 0.2), 0.8).toFixed(1)}s</strong>
              </div>
            )}
          </div>
        </div>

        {!gameActive && !gameOver && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            background: '#e8f5e8',
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <h3>🌱 Ready to Start?</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Trees will be planted automatically at increasing speed. 
              Your job is to prune strategically to maintain balance!
            </p>
            <button 
              onClick={startGame}
              className="action-button"
              style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
            >
              🚀 Start Endless Mode
            </button>
          </div>
        )}

        {selectedAction && gameActive && (
          <div style={{ 
            background: '#fff3cd', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '2px solid #ffc107'
          }}>
            {selectedAction === 'plant' ? 
              'Click anywhere to plant an extra tree (+5 points)' :
              'Click on a tree to prune it (strategic bonus!)'
            }
          </div>
        )}

        <TreeCanvas 
          treeStructure={treeStructure}
          balanceFactor={balanceFactor}
          onTreeClick={handleTreeClick}
        />

        {gameOver && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            padding: '2rem',
            background: score > highScore ? '#d4f6d4' : '#ffebee',
            borderRadius: '10px',
            border: `2px solid ${score > highScore ? '#6b8e23' : '#f44336'}`
          }}>
            <h3>{score > highScore ? '🎉 New High Score! 🎉' : '🌪️ Grove Overwhelmed!'}</h3>
            <div style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
              <div>Final Score: <strong>{score}</strong></div>
              <div>Time Survived: <strong>{formatTime(time)}</strong></div>
              <div>Max Difficulty: <strong>{difficulty.toFixed(1)}</strong></div>
            </div>
            <button 
              onClick={startGame}
              className="action-button"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Game tips */}
        <div style={{ 
          marginTop: '2rem', 
          background: '#f0f8ff', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '2px solid #4fc3f7'
        }}>
          <h4>🎯 Strategy Tips</h4>
          <ul style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <li><strong>Prune strategically:</strong> Remove trees that create the most imbalance</li>
            <li><strong>Watch the difficulty:</strong> Auto-planting speeds up over time</li>
            <li><strong>Stay ahead:</strong> Don't wait for critical imbalance to act</li>
            <li><strong>Bonus points:</strong> Manual actions give score multipliers</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
