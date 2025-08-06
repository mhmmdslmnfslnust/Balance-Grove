// puzzleMode.js
// Puzzle mode page
import React, { useState } from 'react';
import AVLTree from '../utils/AVLTree';
import TreeCanvas from '../components/TreeCanvas';
import ControlPanel from '../components/ControlPanel';

const initialTrees = [40, 20, 60];

export default function PuzzleMode() {
  const [avl] = useState(new AVLTree());
  const [moves, setMoves] = useState(0);
  const [trees, setTrees] = useState(initialTrees);
  const [tensionNodes, setTensionNodes] = useState([]);
  const [balanceMeter, setBalanceMeter] = useState(0);

  // Insert initial trees
  React.useEffect(() => {
    initialTrees.forEach(val => avl.insertTree(val));
    updateState();
    // eslint-disable-next-line
  }, []);

  function updateState() {
    const structure = avl.getTreeStructure();
    // Abstract layout: just spread horizontally for now
    let nodes = [];
    function traverse(node, x, y, id) {
      if (!node) return;
      nodes.push({ x, y, id, animate: false });
      traverse(node.left, x-120, y+80, id*2);
      traverse(node.right, x+120, y+80, id*2+1);
    }
    traverse(structure, 400, 60, 1);
    setTrees(nodes);
    // Find tension nodes
    let tension = [];
    function findTension(node, id) {
      if (!node) return;
      if (Math.abs((node.left?.height||0)-(node.right?.height||0)) > 1) tension.push(id);
      findTension(node.left, id*2);
      findTension(node.right, id*2+1);
    }
    findTension(structure, 1);
    setTensionNodes(tension);
    setBalanceMeter(Math.max(...nodes.map(n => Math.abs((structure.left?.height||0)-(structure.right?.height||0)))));
  }

  function handleAction(action) {
    if (action === 'plant') {
      avl.insertTree(Math.floor(Math.random()*100));
      setMoves(moves+1);
    }
    if (action === 'prune') {
      avl.deleteTree(trees[trees.length-1]?.id || 1);
      setMoves(moves+1);
    }
    updateState();
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ControlPanel mode="Puzzle" onAction={handleAction} balanceMeter={balanceMeter} />
      <main style={{ flex: 1, padding: 32 }}>
        <h3>Objective: Balance the grove in 4 moves</h3>
        <TreeCanvas trees={trees} tensionNodes={tensionNodes} />
        <div>Moves: {moves}</div>
      </main>
    </div>
  );
}
