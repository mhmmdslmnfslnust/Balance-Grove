// puzzleMode.js
// Puzzle mode page with level-based challenges
import React, { useState, useEffect } from 'react';
import { useGame } from '../utils/GameContext';
import TreeCanvas from '../components/TreeCanvas';
import ControlPanel from '../components/ControlPanel';

const PUZZLE_LEVELS = [
  {
    id: 1,
    name: "First Steps",
    description: "Balance this simple grove",
    initialTrees: [10, 5, 15],
    maxMoves: 3,
    objective: "Create a balanced grove"
  },
  {
    id: 2,
    name: "Growing Challenge",
    description: "A more complex arrangement",
    initialTrees: [20, 10, 30, 5],
    maxMoves: 4,
    objective: "Restore harmony to the grove"
  },
  {
    id: 3,
    name: "Master Gardener",
    description: "The ultimate balance test",
    initialTrees: [50, 25, 75, 12, 37, 62, 87],
    maxMoves: 5,
    objective: "Achieve perfect balance"
  }
];

export default function PuzzleMode() {
  const {
    treeStructure,
    balanceFactor,
    plantTree,
    pruneTree,
    preloadTree
  } = useGame();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const level = PUZZLE_LEVELS[currentLevel];

  // Initialize level
  useEffect(() => {
    if (level) {
      preloadTree(level.initialTrees);
      setMoves(0);
      setGameWon(false);
      setSelectedAction(null);
    }
  }, [currentLevel, level, preloadTree]);

  // Check win condition
  useEffect(() => {
    if (balanceFactor <= 1 && moves > 0 && moves <= level?.maxMoves) {
      setGameWon(true);
    }
  }, [balanceFactor, moves, level]);

  const handleAction = (action) => {
    if (gameWon || moves >= level.maxMoves) return;

    if (action === 'plant') {
      setSelectedAction('plant');
      setSelectedValue(null);
    } else if (action === 'prune') {
      setSelectedAction('prune');
      setSelectedValue(null);
    } else if (action === 'reset') {
      preloadTree(level.initialTrees);
      setMoves(0);
      setGameWon(false);
      setSelectedAction(null);
    } else if (action === 'inspect') {
      alert(`Grove Status:\nBalance Factor: ${balanceFactor}\nMoves Used: ${moves}/${level.maxMoves}\nObjective: ${level.objective}`);
    }
  };

  const handleTreeClick = (value) => {
    if (gameWon || moves >= level.maxMoves) return;

    if (selectedAction === 'plant') {
      const newValue = Math.floor(Math.random() * 100) + 1;
      plantTree(newValue);
      setMoves(moves + 1);
      setSelectedAction(null);
    } else if (selectedAction === 'prune' && value) {
      pruneTree(value);
      setMoves(moves + 1);
      setSelectedAction(null);
    }
  };

  const nextLevel = () => {
    if (currentLevel < PUZZLE_LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const prevLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  return (
    <div className="game-container">
      <ControlPanel 
        mode="Puzzle" 
        balanceFactor={balanceFactor}
        onAction={handleAction}
        moves={moves}
        maxMoves={level?.maxMoves}
        gameWon={gameWon}
      />
      
      <main className="main-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2>Level {level?.id}: {level?.name}</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{level?.description}</p>
          <p><strong>Objective:</strong> {level?.objective}</p>
          
          <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={prevLevel} 
              disabled={currentLevel === 0}
              className="action-button"
              style={{ padding: '0.5rem 1rem' }}
            >
              ← Previous
            </button>
            
            <span>Level {currentLevel + 1} of {PUZZLE_LEVELS.length}</span>
            
            <button 
              onClick={nextLevel} 
              disabled={currentLevel === PUZZLE_LEVELS.length - 1}
              className="action-button"
              style={{ padding: '0.5rem 1rem' }}
            >
              Next →
            </button>
          </div>
        </div>

        {selectedAction && (
          <div style={{ 
            background: '#ffffcc', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '2px solid #ffeb3b'
          }}>
            {selectedAction === 'plant' ? 
              'Click anywhere in the grove to plant a new tree' :
              'Click on a tree to prune it'
            }
          </div>
        )}

        <TreeCanvas 
          treeStructure={treeStructure}
          balanceFactor={balanceFactor}
          onTreeClick={handleTreeClick}
        />

        {gameWon && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            padding: '1rem',
            background: '#d4f6d4',
            borderRadius: '8px',
            border: '2px solid #6b8e23'
          }}>
            <h3>🎉 Level Complete! 🎉</h3>
            <p>You balanced the grove in {moves} moves!</p>
            {currentLevel < PUZZLE_LEVELS.length - 1 && (
              <button 
                onClick={nextLevel}
                className="action-button"
                style={{ marginTop: '1rem' }}
              >
                Continue to Next Level
              </button>
            )}
          </div>
        )}

        {moves >= level?.maxMoves && !gameWon && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '2px solid #f44336'
          }}>
            <h3>🌪️ Challenge Failed</h3>
            <p>You've used all {level.maxMoves} moves. Try again!</p>
            <button 
              onClick={() => handleAction('reset')}
              className="action-button"
              style={{ marginTop: '1rem' }}
            >
              Restart Level
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
