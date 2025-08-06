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

  // Compare function that handles both numbers and letters
  compare(a, b) {
    // Convert to string for consistent comparison
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();
    
    // If both are numbers, compare numerically
    if (!isNaN(a) && !isNaN(b)) {
      return Number(a) - Number(b);
    }
    
    // If both are single characters, compare alphabetically
    if (aStr.length === 1 && bStr.length === 1 && /[a-z]/.test(aStr) && /[a-z]/.test(bStr)) {
      return aStr.charCodeAt(0) - bStr.charCodeAt(0);
    }
    
    // Default string comparison
    return aStr.localeCompare(bStr);
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
    if (!y || !y.left) return y; // Safety check
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  rotateLeft(x) {
    if (!x || !x.right) return x; // Safety check
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
    const cmp = this.compare(value, node.value);
    if (cmp < 0) {
      node.left = this.insert(node.left, value);
    } else if (cmp > 0) {
      node.right = this.insert(node.right, value);
    } else {
      return node; // Duplicate value
    }
    this.updateHeight(node);
    return node;
  }

  add(value) {
    this.root = this.insert(this.root, value);
  }

  // Manual rotation at a node with given value
  manualRotateLeft(value) {
    this.root = this._manualRotate(this.root, value, 'left');
  }
  manualRotateRight(value) {
    this.root = this._manualRotate(this.root, value, 'right');
  }
  _manualRotate(node, value, dir) {
    if (!node) return null;
    if (node.value === value) {
      if (dir === 'left' && node.right) return this.rotateLeft(node);
      if (dir === 'right' && node.left) return this.rotateRight(node);
      return node; // Can't rotate if no child in that direction
    }
    node.left = this._manualRotate(node.left, value, dir);
    node.right = this._manualRotate(node.right, value, dir);
    this.updateHeight(node);
    return node;
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

  // Auto-balancing insert
  autoBalanceInsert(node, value) {
    if (!node) return new TreeNode(value);
    const cmp = this.compare(value, node.value);
    if (cmp < 0) {
      node.left = this.autoBalanceInsert(node.left, value);
    } else if (cmp > 0) {
      node.right = this.autoBalanceInsert(node.right, value);
    } else {
      return node;
    }
    
    this.updateHeight(node);
    const balance = this.getBalance(node);
    
    // Auto-balance the tree
    const leftCmp = node.left ? this.compare(value, node.left.value) : 0;
    const rightCmp = node.right ? this.compare(value, node.right.value) : 0;
    
    if (balance > 1 && leftCmp < 0) {
      return this.rotateRight(node);
    }
    if (balance < -1 && rightCmp > 0) {
      return this.rotateLeft(node);
    }
    if (balance > 1 && leftCmp > 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    
    return node;
  }

  // Remove node
  remove(value) {
    this.root = this._remove(this.root, value);
  }

  _remove(node, value) {
    if (!node) return null;
    
    const cmp = this.compare(value, node.value);
    if (cmp < 0) {
      node.left = this._remove(node.left, value);
    } else if (cmp > 0) {
      node.right = this._remove(node.right, value);
    } else {
      // Node to be deleted found
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        // Node with two children
        const minRight = this._findMin(node.right);
        node.value = minRight.value;
        node.right = this._remove(node.right, minRight.value);
      }
    }
    
    if (!node) return node;
    this.updateHeight(node);
    return node;
  }

  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }

  toArray() {
    const result = [];
    const edges = [];
    
    const traverse = (node, x = 400, y = 80, xOffset = 120) => {
      if (!node) return x;
      
      const leftX = traverse(node.left, x - xOffset, y + 80, xOffset * 0.6);
      
      // Add edges with source/target values
      if (node.left) {
        edges.push({
          x1: leftX,
          y1: y,
          x2: leftX - xOffset,
          y2: y + 80,
          sourceValue: node.value,
          targetValue: node.left.value
        });
      }
      if (node.right) {
        edges.push({
          x1: leftX,
          y1: y,
          x2: leftX + xOffset * 2,
          y2: y + 80,
          sourceValue: node.value,
          targetValue: node.right.value
        });
      }
      
      result.push({ 
        value: node.value, 
        x: leftX, 
        y, 
        balance: this.getBalance(node),
        height: node.height 
      });
      
      return traverse(node.right, leftX + xOffset * 2, y + 80, xOffset * 0.6);
    };
    
    traverse(this.root);
    return { nodes: result, edges };
  }
}

function App() {
  const [tree] = useState(() => new AVLTree());
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });
  const [gameMode, setGameMode] = useState('menu');
  const [treeMode, setTreeMode] = useState('manual'); // 'manual', 'auto', 'interactive'
  const [dataMode, setDataMode] = useState('numbers'); // 'numbers', 'alphabet'
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [maxBalance, setMaxBalance] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [usedValues, setUsedValues] = useState(new Set());
  const [imbalancedNodes, setImbalancedNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [customValue, setCustomValue] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isProtectedMode, setIsProtectedMode] = useState(true); // For demo mode
  const [gameHistory, setGameHistory] = useState([]); // For undo functionality
  const [redoHistory, setRedoHistory] = useState([]); // For redo functionality
  const [removeValue, setRemoveValue] = useState(''); // For removing specific nodes

  // Generate random unique value for BST
  const generateRandomValue = useCallback(() => {
    let attempts = 0;
    let newValue;
    
    if (dataMode === 'alphabet') {
      do {
        // Generate random uppercase letter A-Z
        newValue = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        attempts++;
        
        // Prevent infinite loop if we run out of values
        if (attempts > 100) {
          // Find first available letter if random generation fails
          for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            if (!usedValues.has(letter)) {
              newValue = letter;
              break;
            }
          }
          break;
        }
      } while (usedValues.has(newValue));
    } else {
      do {
        // Generate random value between 1-99
        newValue = Math.floor(Math.random() * 99) + 1;
        attempts++;
        
        // Prevent infinite loop if we run out of values
        if (attempts > 100) {
          // Find first available value if random generation fails
          for (let i = 1; i <= 99; i++) {
            if (!usedValues.has(i)) {
              newValue = i;
              break;
            }
          }
          break;
        }
      } while (usedValues.has(newValue));
    }
    
    return newValue;
  }, [usedValues, dataMode]);

  const updateGameState = useCallback(() => {
    const data = tree.toArray();
    setTreeData(data);
    const balance = tree.getMaxBalance();
    setMaxBalance(balance);
    // Find imbalanced nodes
    const imbalanced = data.nodes.filter(n => Math.abs(n.balance) > 1).map(n => n.value);
    setImbalancedNodes(imbalanced);
    if (balance > 2 && treeMode === 'manual' && isProtectedMode) {
      setGameStatus('lost');
    }
  }, [tree, treeMode, isProtectedMode]);

  // Save current game state for undo functionality
  const saveGameState = useCallback(() => {
    const treeClone = new AVLTree();
    if (tree.root) {
      const traverse = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.height = node.height;
        newNode.left = traverse(node.left);
        newNode.right = traverse(node.right);
        return newNode;
      };
      treeClone.root = traverse(tree.root);
    }
    
    const gameState = {
      tree: treeClone,
      usedValues: new Set(usedValues),
      score,
      moves
    };
    
    setGameHistory(prev => [...prev.slice(-9), gameState]); // Keep last 10 states
    setRedoHistory([]); // Clear redo history when new action is made
  }, [tree, usedValues, score, moves]);

  // Undo last action
  const undoLastAction = useCallback(() => {
    if (gameHistory.length === 0) return;
    
    // Save current state to redo history before undoing
    const currentTree = new AVLTree();
    if (tree.root) {
      const traverse = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.height = node.height;
        newNode.left = traverse(node.left);
        newNode.right = traverse(node.right);
        return newNode;
      };
      currentTree.root = traverse(tree.root);
    }
    
    const currentState = {
      tree: currentTree,
      usedValues: new Set(usedValues),
      score,
      moves
    };
    
    setRedoHistory(prev => [...prev.slice(-9), currentState]); // Keep last 10 redo states
    
    const lastState = gameHistory[gameHistory.length - 1];
    
    // Restore tree state
    if (lastState.tree.root) {
      const traverse = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.height = node.height;
        newNode.left = traverse(node.left);
        newNode.right = traverse(node.right);
        return newNode;
      };
      tree.root = traverse(lastState.tree.root);
    } else {
      tree.root = null;
    }
    
    // Restore other state
    setUsedValues(new Set(lastState.usedValues));
    setScore(lastState.score);
    setMoves(lastState.moves);
    setGameHistory(prev => prev.slice(0, -1));
    
    updateGameState();
  }, [gameHistory, tree, updateGameState, usedValues, score, moves]);

  // Redo last undone action
  const redoLastAction = useCallback(() => {
    if (redoHistory.length === 0) return;
    
    // Save current state to undo history before redoing
    const currentTree = new AVLTree();
    if (tree.root) {
      const traverse = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.height = node.height;
        newNode.left = traverse(node.left);
        newNode.right = traverse(node.right);
        return newNode;
      };
      currentTree.root = traverse(tree.root);
    }
    
    const currentState = {
      tree: currentTree,
      usedValues: new Set(usedValues),
      score,
      moves
    };
    
    setGameHistory(prev => [...prev.slice(-9), currentState]); // Keep last 10 states
    
    const redoState = redoHistory[redoHistory.length - 1];
    
    // Restore tree state from redo
    if (redoState.tree.root) {
      const traverse = (node) => {
        if (!node) return null;
        const newNode = new TreeNode(node.value);
        newNode.height = node.height;
        newNode.left = traverse(node.left);
        newNode.right = traverse(node.right);
        return newNode;
      };
      tree.root = traverse(redoState.tree.root);
    } else {
      tree.root = null;
    }
    
    // Restore other state
    setUsedValues(new Set(redoState.usedValues));
    setScore(redoState.score);
    setMoves(redoState.moves);
    setRedoHistory(prev => prev.slice(0, -1));
    
    updateGameState();
  }, [redoHistory, tree, updateGameState, usedValues, score, moves]);

  // Zoom and pan controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  // Mouse drag for panning
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    const startX = e.clientX - panX;
    const startY = e.clientY - panY;
    
    const handleMouseMove = (e) => {
      setPanX(e.clientX - startX);
      setPanY(e.clientY - startY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addNode = useCallback((value) => {
    if (gameStatus !== 'playing') return;
    
    let processedValue = value;
    
    // Process value based on data mode
    if (dataMode === 'alphabet') {
      // Convert to uppercase single letter
      processedValue = value.toString().toUpperCase().charAt(0);
      if (processedValue < 'A' || processedValue > 'Z') return;
    } else {
      // Process as number
      const numValue = parseInt(value);
      if (isNaN(numValue)) return;
      processedValue = numValue;
    }
    
    // Check if value already exists
    if (usedValues.has(processedValue)) {
      console.log(`Value ${processedValue} already exists in the tree!`);
      return;
    }
    
    // Save state before making changes (for undo)
    if (gameMode === 'demo') {
      saveGameState();
    }
    
    // In protected mode, check if adding would exceed balance factor
    if (isProtectedMode && gameMode === 'demo') {
      // Temporarily add the node to check balance
      const tempTree = new AVLTree();
      if (tree.root) {
        const cloneNode = (node) => {
          if (!node) return null;
          const newNode = new TreeNode(node.value);
          newNode.height = node.height;
          newNode.left = cloneNode(node.left);
          newNode.right = cloneNode(node.right);
          return newNode;
        };
        tempTree.root = cloneNode(tree.root);
      }
      tempTree.add(processedValue);
      
      if (tempTree.getMaxBalance() > 2) {
        console.log(`Cannot add ${processedValue} - would exceed balance factor of 2 in protected mode!`);
        return;
      }
    }
    
    if (treeMode === 'auto') {
      tree.root = tree.autoBalanceInsert(tree.root, processedValue);
    } else {
      tree.add(processedValue);
    }
    
    // Track the used value
    setUsedValues(prev => new Set(prev).add(processedValue));
    setMoves(moves + 1);
    setScore(score + 10);
    updateGameState();
  }, [gameStatus, treeMode, tree, moves, score, updateGameState, usedValues, saveGameState, isProtectedMode, gameMode, dataMode]);

  const removeNode = (value) => {
    if (gameStatus !== 'playing') return;
    
    // Save state before making changes (for undo)
    if (gameMode === 'demo') {
      saveGameState();
    }
    
    tree.remove(value);
    
    // Remove from used values set
    setUsedValues(prev => {
      const newSet = new Set(prev);
      newSet.delete(value);
      return newSet;
    });
    
    setMoves(moves + 1);
    setScore(score + 5);
    setSelectedNode(null);
    updateGameState();
  };

  const plantTree = () => {
    const randomValue = generateRandomValue();
    addNode(randomValue);
  };

  const addCustomNode = () => {
    if (customValue.trim() === '') return;
    addNode(customValue);
    setCustomValue('');
  };

  const rotateNode = (value, dir) => {
    if (gameStatus !== 'playing') return;
    
    // Find the node in the tree to check if rotation is possible
    const findNode = (node, targetValue) => {
      if (!node) return null;
      if (node.value === targetValue) return node;
      const leftResult = findNode(node.left, targetValue);
      if (leftResult) return leftResult;
      return findNode(node.right, targetValue);
    };
    
    const targetNode = findNode(tree.root, value);
    if (!targetNode) return;
    
    // Check if rotation is possible
    if (dir === 'left' && !targetNode.right) return;
    if (dir === 'right' && !targetNode.left) return;
    
    if (dir === 'left') tree.manualRotateLeft(value);
    if (dir === 'right') tree.manualRotateRight(value);
    setMoves(moves + 1);
    setScore(score + 5);
    setSelectedNode(null);
    updateGameState();
  };

  const resetGame = () => {
    tree.root = null;
    setTreeData({ nodes: [], edges: [] });
    setScore(0);
    setMoves(0);
    setMaxBalance(0);
    setGameStatus('playing');
    setUsedValues(new Set());
    setSelectedNode(null);
    setCustomValue('');
    setRemoveValue('');
    setGameHistory([]);
    setRedoHistory([]);
  };

  const removeNodeByValue = () => {
    const numValue = parseInt(removeValue);
    if (isNaN(numValue) || !usedValues.has(numValue)) {
      console.log(`Value ${numValue} does not exist in the tree!`);
      return;
    }
    
    removeNode(numValue);
    setRemoveValue('');
  };

  const startMode = (mode, initialTreeMode = 'manual') => {
    resetGame();
    setGameMode(mode);
    setTreeMode(initialTreeMode);
    
    // Removed automatic preset trees - users can click preset buttons instead
    updateGameState();
  };

  useEffect(() => {
    if (gameMode === 'endless' && gameStatus === 'playing' && treeMode !== 'interactive') {
      const interval = setInterval(() => {
        if (gameStatus === 'playing') {
          const randomValue = generateRandomValue();
          addNode(randomValue);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gameMode, gameStatus, treeMode, addNode, generateRandomValue]);

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <div className="menu">
          <h1>🌳 Balance Grove 🌳</h1>
          <p>Experience AVL Tree balancing in multiple ways!</p>
          
          <div className="data-mode-selection">
            <h3>Data Type:</h3>
            <div className="toggle-buttons">
              <button 
                className={dataMode === 'numbers' ? 'active' : ''}
                onClick={() => setDataMode('numbers')}
              >
                🔢 Numbers (1-99)
              </button>
              <button 
                className={dataMode === 'alphabet' ? 'active' : ''}
                onClick={() => setDataMode('alphabet')}
              >
                🔤 Letters (A-Z)
              </button>
            </div>
          </div>
          
          <div className="mode-grid">
            <div className="mode-card">
              <h3>🎮 Interactive Mode</h3>
              <p>Add and remove nodes freely. Perfect for learning!</p>
              <div className="sub-modes">
                <button onClick={() => startMode('interactive', 'manual')}>
                  Manual Balancing
                </button>
                <button onClick={() => startMode('interactive', 'auto')}>
                  Auto Balancing
                </button>
              </div>
            </div>
            
            <div className="mode-card">
              <h3>🧩 Puzzle Mode</h3>
              <p>Balance pre-built challenging tree configurations</p>
              <button onClick={() => startMode('puzzle', 'manual')}>
                Start Puzzle
              </button>
            </div>
            
            <div className="mode-card">
              <h3>♾️ Endless Mode</h3>
              <p>Survive as long as possible with automatic node addition</p>
              <div className="sub-modes">
                <button onClick={() => startMode('endless', 'manual')}>
                  Manual Challenge
                </button>
                <button onClick={() => startMode('endless', 'auto')}>
                  Auto Demo
                </button>
              </div>
            </div>
            
            <div className="mode-card">
              <h3>📚 Demo Mode</h3>
              <p>Add custom values, remove nodes, with protected/unprotected modes and undo functionality</p>
              <div className="sub-modes">
                <button onClick={() => startMode('demo', 'manual')}>
                  Manual Demo
                </button>
                <button onClick={() => startMode('demo', 'auto')}>
                  Auto Demo
                </button>
              </div>
            </div>
          </div>
          
          <div className="help-section">
            <button onClick={() => setShowHelp(!showHelp)} className="help-btn">
              {showHelp ? 'Hide' : 'Show'} Help
            </button>
            {showHelp && (
              <div className="help-content">
                <h4>How to Play:</h4>
                <ul>
                  <li><strong>Manual Mode:</strong> Click red nodes to rotate and balance them</li>
                  <li><strong>Auto Mode:</strong> Watch the tree self-balance automatically</li>
                  <li><strong>Interactive:</strong> Add/remove any values you want</li>
                  <li><strong>Demo Mode:</strong> Add custom values, remove specific nodes, use undo</li>
                  <li><strong>Protected Mode:</strong> Cannot exceed balance factor ±2</li>
                  <li><strong>Unprotected Mode:</strong> Can exceed balance factor (for learning)</li>
                  <li><strong>Balance Factor:</strong> Shown above each node (should be -1, 0, or 1)</li>
                  <li><strong>Goal:</strong> Keep the tree balanced and learn AVL operations</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="game-header">
        <button onClick={() => setGameMode('menu')} className="back-btn">
          ← Back to Menu
        </button>
        <div className="mode-info">
          <h2>🌳 Balance Grove</h2>
          <span className="mode-badge">
            {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} - {treeMode.charAt(0).toUpperCase() + treeMode.slice(1)}
          </span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max Balance</span>
            <span className={`stat-value ${maxBalance > 1 ? 'warning' : 'good'}`}>
              {maxBalance > 1 ? '⚠️ ' + maxBalance : '✅ ' + maxBalance}
            </span>
          </div>
        </div>
      </header>

      <main className="game-area">
        <div className="tree-container" style={{ 
          background: maxBalance > 1 ? 'rgba(255, 107, 107, 0.05)' : 'rgba(78, 205, 196, 0.03)',
          transition: 'background 0.5s ease'
        }}>
          <div className="zoom-controls">
            <button onClick={handleZoomOut} className="zoom-btn">−</button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} className="zoom-btn">+</button>
            <button onClick={handleResetView} className="reset-view-btn">⌂</button>
          </div>
          
          <svg 
            width="100%" 
            height="400" 
            viewBox="0 0 800 400" 
            className="tree-svg"
            onMouseDown={handleMouseDown}
            style={{ cursor: 'grab' }}
          >
            {/* Define gradients and effects */}
            <defs>
              <linearGradient id="balancedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#4ecdc4', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#44a08d', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="imbalancedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ff6b6b', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#ee5a52', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            
            <g transform={`translate(${panX}, ${panY}) scale(${zoomLevel})`}>
            {/* Render edges first */}
            {treeData.edges.map((edge, index) => (
              <line
                key={`edge-${index}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                className="tree-edge"
              />
            ))}
            
            {/* Render nodes */}
            {treeData.nodes.map((node, index) => {
              const isImbalanced = Math.abs(node.balance) > 1;
              const isSelected = selectedNode === node.value;
              
              const nodeClasses = [
                'tree-node',
                isImbalanced ? 'imbalanced' : 'balanced',
                isSelected ? 'selected' : ''
              ].filter(Boolean).join(' ');
              
              return (
                <g key={node.value} className={nodeClasses}>
                  {/* Node shadow */}
                  <circle
                    cx={node.x + 3}
                    cy={node.y + 3}
                    r="28"
                    className="node-shadow"
                  />
                  
                  {/* Main node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    className="node-circle"
                    onClick={() => {
                      if (treeMode === 'interactive') {
                        setSelectedNode(selectedNode === node.value ? null : node.value);
                      } else if (treeMode === 'manual') {
                        // Allow selection of any node in manual mode for learning
                        setSelectedNode(node.value);
                      }
                    }}
                  />
                  
                  {/* Node value */}
                  <text
                    x={node.x}
                    y={node.y + 2}
                    className="node-value"
                  >
                    {node.value}
                  </text>
                  
                  {/* Balance factor badge */}
                  <rect
                    x={node.x - 18}
                    y={node.y - 50}
                    width="36"
                    height="20"
                    rx="10"
                    className={`balance-badge ${Math.abs(node.balance) > 1 ? 'imbalanced' : 'balanced'}`}
                  />
                  <text
                    x={node.x}
                    y={node.y - 38}
                    className="balance-text"
                  >
                    {node.balance}
                  </text>
                  
                  {/* Height indicator */}
                  <text
                    x={node.x + 40}
                    y={node.y + 5}
                    className="height-text"
                  >
                    H:{node.height}
                  </text>
                </g>
              );
            })}
            </g>
          </svg>
        </div>

        {/* Controls Panel */}
        <div className="controls-panel">
          <div className="control-section">
            <h3>Tree Operations</h3>
            <div className="control-group">
              {gameMode === 'demo' ? (
                <>
                  <div className="input-group">
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      placeholder={dataMode === 'alphabet' ? 'Add letter (A-Z)' : 'Add value (1-99)'}
                      maxLength={dataMode === 'alphabet' ? 1 : undefined}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomNode()}
                    />
                    <button onClick={addCustomNode} disabled={gameStatus !== 'playing'}>
                      ➕ Add Node
                    </button>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={removeValue}
                      onChange={(e) => setRemoveValue(e.target.value)}
                      placeholder={dataMode === 'alphabet' ? 'Remove letter' : 'Remove value'}
                      maxLength={dataMode === 'alphabet' ? 1 : undefined}
                      onKeyPress={(e) => e.key === 'Enter' && removeNodeByValue()}
                    />
                    <button onClick={removeNodeByValue} disabled={gameStatus !== 'playing'}>
                      🗑️ Remove
                    </button>
                  </div>
                </>
              ) : treeMode === 'interactive' ? (
                <>
                  <div className="input-group">
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      placeholder={dataMode === 'alphabet' ? 'Enter letter (A-Z)' : 'Enter value (1-99)'}
                      maxLength={dataMode === 'alphabet' ? 1 : undefined}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomNode()}
                    />
                    <button onClick={addCustomNode} disabled={gameStatus !== 'playing'}>
                      ➕ Add Node
                    </button>
                  </div>
                  {selectedNode !== null && (
                    <button 
                      onClick={() => removeNode(selectedNode)} 
                      className="remove-btn"
                      disabled={gameStatus !== 'playing'}
                    >
                      🗑️ Remove {selectedNode}
                    </button>
                  )}
                </>
              ) : (
                <button 
                  onClick={plantTree} 
                  disabled={gameStatus !== 'playing'}
                  className="plant-btn"
                >
                  🌱 Add Random Tree
                </button>
              )}
            </div>
          </div>
          
          <div className="control-section">
            <h3>Actions</h3>
            <div className="control-group">
              {gameMode === 'demo' && (
                <>
                  <button 
                    onClick={() => setIsProtectedMode(!isProtectedMode)} 
                    className={`mode-toggle ${isProtectedMode ? 'protected' : 'unprotected'}`}
                  >
                    {isProtectedMode ? '🛡️ Protected' : '⚠️ Unprotected'}
                  </button>
                  <button 
                    onClick={undoLastAction} 
                    disabled={gameHistory.length === 0}
                    className="undo-btn"
                  >
                    ↶ Undo ({gameHistory.length})
                  </button>
                  <button 
                    onClick={redoLastAction} 
                    disabled={redoHistory.length === 0}
                    className="redo-btn"
                  >
                    ↷ Redo ({redoHistory.length})
                  </button>
                </>
              )}
              <button onClick={resetGame} className="reset-btn">
                🔄 Reset Tree
              </button>
              <button onClick={() => setTreeMode(treeMode === 'auto' ? 'manual' : 'auto')} className="mode-toggle">
                🔀 Switch to {treeMode === 'auto' ? 'Manual' : 'Auto'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Rotation Controls Overlay */}
      {selectedNode !== null && treeMode === 'manual' && (
        <div className="rotation-overlay">
          <div className="rotation-panel">
            <h4>Balance Node {selectedNode}</h4>
            <div className="rotation-buttons">
              {(() => {
                const findNode = (n, val) => {
                  if (!n) return null;
                  if (n.value === val) return n;
                  return findNode(n.left, val) || findNode(n.right, val);
                };
                const targetNode = findNode(tree.root, selectedNode);
                
                // Allow rotation if node has the appropriate child - let user decide when to rotate
                const canRotateLeft = targetNode && targetNode.right;
                const canRotateRight = targetNode && targetNode.left;
                
                return (
                  <>
                    <button 
                      onClick={() => rotateNode(selectedNode, 'left')}
                      disabled={!canRotateLeft}
                      className={`rotation-btn ${!canRotateLeft ? 'disabled' : ''}`}
                    >
                      ⟲ Rotate Left
                    </button>
                    <button 
                      onClick={() => rotateNode(selectedNode, 'right')}
                      disabled={!canRotateRight}
                      className={`rotation-btn ${!canRotateRight ? 'disabled' : ''}`}
                    >
                      ⟳ Rotate Right
                    </button>
                  </>
                );
              })()}
            </div>
            <button onClick={() => {
              setSelectedNode(null);
            }} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {gameStatus === 'lost' && (
        <div className="status-overlay">
          <div className="game-over-panel">
            <h3>🌪️ Tree Collapsed!</h3>
            <p>The tree became too imbalanced (balance factor &gt; 2)</p>
            <p>Final Score: <strong>{score}</strong></p>
            <button onClick={resetGame} className="retry-btn">Try Again</button>
          </div>
        </div>
      )}

      {maxBalance > 1 && gameStatus === 'playing' && treeMode === 'manual' && (
        <div className="warning-icon-container">
          <button className="warning-icon-btn">
            ⚠️
            <div className="warning-tooltip">
              <div className="warning-tooltip-text">
                Tree is becoming imbalanced! Balance factor: {maxBalance}
              </div>
              <div className="warning-tooltip-help">
                Click red nodes to balance them
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
