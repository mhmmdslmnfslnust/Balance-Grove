// GameContext.js
// Shared state for the AVL tree game
import React, { createContext, useContext, useState } from 'react';
import AVLTree from './AVLTree';

const GameContext = createContext();

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }) {
  const [avlTree] = useState(() => new AVLTree());
  const [treeStructure, setTreeStructure] = useState(null);
  const [balanceFactor, setBalanceFactor] = useState(0);
  const [lastAction, setLastAction] = useState(null);
  const [animatingNodes, setAnimatingNodes] = useState([]);

  const updateTreeState = () => {
    const structure = avlTree.getTreeStructure();
    setTreeStructure(structure);
    
    // Calculate overall balance factor using the new method
    const maxBalance = avlTree.getMaxBalanceFactor();
    setBalanceFactor(maxBalance);
  };

  const plantTree = (value = null) => {
    const treeValue = value || Math.floor(Math.random() * 100) + 1;
    avlTree.insertTree(treeValue);
    setLastAction({ type: 'plant', value: treeValue });
    updateTreeState();
    return treeValue;
  };

  const pruneTree = (value) => {
    if (value) {
      avlTree.deleteTree(value);
      setLastAction({ type: 'prune', value });
      updateTreeState();
      return true;
    }
    return false;
  };

  const resetTree = () => {
    avlTree.root = null;
    setLastAction({ type: 'reset' });
    updateTreeState();
  };

  const preloadTree = (values) => {
    avlTree.root = null;
    values.forEach(value => avlTree.insertTree(value));
    setLastAction({ type: 'preload', values });
    updateTreeState();
  };

  const value = {
    treeStructure,
    balanceFactor,
    lastAction,
    animatingNodes,
    setAnimatingNodes,
    plantTree,
    pruneTree,
    resetTree,
    preloadTree,
    updateTreeState
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
