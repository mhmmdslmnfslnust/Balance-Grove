// App.js
// Completely rewritten Balance Grove game
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Simple AVL Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// Simple AVL Tree implementation
class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    if (node) {
      node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  insert(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    } else {
      return node;
    }

    this.updateHeight(node);
    const balance = this.getBalance(node);

    // Left Left
    if (balance > 1 && value < node.left.value) {
      return this.rotateRight(node);
    }
    // Right Right
    if (balance < -1 && value > node.right.value) {
      return this.rotateLeft(node);
    }
    // Left Right
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    // Right Left
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  add(value) {
    this.root = this.insert(this.root, value);
  }

  getMaxBalance() {
    const checkBalance = (node) => {
      if (!node) return 0;
      const nodeBalance = Math.abs(this.getBalance(node));
      const leftBalance = checkBalance(node.left);
      const rightBalance = checkBalance(node.right);
      return Math.max(nodeBalance, leftBalance, rightBalance);
    };
    return checkBalance(this.root);
  }

  toArray() {
    const result = [];
    const inorder = (node, x = 400, y = 60, xOffset = 100) => {
      if (!node) return x;
      
      const leftX = inorder(node.left, x - xOffset, y + 80, xOffset * 0.7);
      result.push({ 
        value: node.value, 
        x: leftX, 
        y, 
        balance: this.getBalance(node),
        height: node.height 
      });
      return inorder(node.right, leftX + xOffset * 2, y + 80, xOffset * 0.7);
    };
    inorder(this.root);
    return result;
  }
}

function App() {
  const [tree] = useState(() => new AVLTree());
  const [nodes, setNodes] = useState([]);
  const [gameMode, setGameMode] = useState('menu');
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [maxBalance, setMaxBalance] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [nextValue, setNextValue] = useState(1);

  const updateGameState = useCallback(() => {
    const nodeArray = tree.toArray();
    setNodes(nodeArray);
    const balance = tree.getMaxBalance();
    setMaxBalance(balance);
    
    if (balance > 2) {
      setGameStatus('lost');
    }
  }, [tree]);

  const plantTree = () => {
    if (gameStatus !== 'playing') return;
    
    tree.add(nextValue);
    setNextValue(nextValue + 1);
    setMoves(moves + 1);
    setScore(score + 10);
    updateGameState();
  };

  const resetGame = () => {
    tree.root = null;
    setNodes([]);
    setScore(0);
    setMoves(0);
    setMaxBalance(0);
    setGameStatus('playing');
    setNextValue(1);
  };

  const startPuzzleMode = () => {
    resetGame();
    setGameMode('puzzle');
    // Add some initial trees
    [10, 5, 15].forEach(val => tree.add(val));
    setNextValue(20);
    updateGameState();
  };

  const startEndlessMode = () => {
    resetGame();
    setGameMode('endless');
    tree.add(50);
    setNextValue(51);
    updateGameState();
  };

  useEffect(() => {
    if (gameMode === 'endless' && gameStatus === 'playing') {
      const interval = setInterval(() => {
        if (gameStatus === 'playing') {
          tree.add(nextValue);
          setNextValue(prev => prev + 1);
          setMoves(prev => prev + 1);
          setScore(prev => prev + 10);
          updateGameState();
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gameMode, gameStatus, nextValue, tree, updateGameState]);

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <div className="menu">
          <h1>🌳 Balance Grove 🌳</h1>
          <p>Keep the magical forest in harmony!</p>
          <div className="menu-buttons">
            <button onClick={startPuzzleMode}>🧩 Puzzle Mode</button>
            <button onClick={startEndlessMode}>♾️ Endless Mode</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="game-header">
        <button onClick={() => setGameMode('menu')}>← Back to Menu</button>
        <h2>🌳 Balance Grove - {gameMode === 'puzzle' ? 'Puzzle' : 'Endless'}</h2>
        <div className="stats">
          <span>Score: {score}</span>
          <span>Moves: {moves}</span>
          <span className={maxBalance > 1 ? 'warning' : ''}>
            Balance: {maxBalance > 1 ? '⚠️ ' + maxBalance : '✅ ' + maxBalance}
          </span>
        </div>
      </header>

      <main className="game-area">
        <div className="forest" style={{ 
          background: maxBalance > 1 ? '#ffebee' : '#e8f5e8',
          transition: 'background 0.5s ease'
        }}>
          <svg width="100%" height="400" viewBox="0 0 800 400">
            {nodes.map((node, index) => (
              <g key={node.value}>
                {/* Tree */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={Math.abs(node.balance) > 1 ? '#ff6b6b' : '#4caf50'}
                  stroke={Math.abs(node.balance) > 1 ? '#d32f2f' : '#2e7d32'}
                  strokeWidth="2"
                  style={{
                    filter: Math.abs(node.balance) > 1 ? 'drop-shadow(0 0 10px rgba(255,0,0,0.5))' : 'none',
                    animation: Math.abs(node.balance) > 1 ? 'shake 0.5s infinite' : 'none'
                  }}
                />
                {/* Tree trunk */}
                <rect
                  x={node.x - 3}
                  y={node.y + 15}
                  width="6"
                  height="15"
                  fill="#8d6e63"
                />
                {/* Value label for debugging */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {node.value}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="controls">
          <button 
            onClick={plantTree} 
            disabled={gameStatus !== 'playing'}
            className="plant-btn"
          >
            🌱 Plant Tree ({nextValue})
          </button>
          <button onClick={resetGame} className="reset-btn">
            🔄 Reset Grove
          </button>
        </div>

        {gameStatus === 'lost' && (
          <div className="game-over">
            <h3>🌪️ The Grove is Too Imbalanced!</h3>
            <p>The forest spirits are upset. Balance factor exceeded 2!</p>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Try Again</button>
          </div>
        )}

        {maxBalance > 1 && gameStatus === 'playing' && (
          <div className="warning-message">
            ⚠️ The grove is becoming imbalanced! Current balance: {maxBalance}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
