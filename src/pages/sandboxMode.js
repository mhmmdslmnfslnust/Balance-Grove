// sandboxMode.js
// Sandbox mode page
import React, { useState } from 'react';
import AVLTree from '../utils/AVLTree';
import TreeCanvas from '../components/TreeCanvas';
import ControlPanel from '../components/ControlPanel';

export default function SandboxMode() {
  const [avl] = useState(new AVLTree());
  const [trees, setTrees] = useState([]);
  const [tensionNodes, setTensionNodes] = useState([]);
  const [balanceMeter, setBalanceMeter] = useState(0);
  const [showStructure, setShowStructure] = useState(false);

  function updateState() {
    const structure = avl.getTreeStructure();
    let nodes = [];
    function traverse(node, x, y, id) {
      if (!node) return;
      nodes.push({ x, y, id, animate: false });
      traverse(node.left, x-120, y+80, id*2);
      traverse(node.right, x+120, y+80, id*2+1);
    }
    traverse(structure, 400, 60, 1);
    setTrees(nodes);
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
    }
    if (action === 'prune') {
      avl.deleteTree(trees[trees.length-1]?.id || 1);
    }
    if (action === 'inspect') {
      setShowStructure(!showStructure);
    }
    updateState();
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ControlPanel mode="Sandbox" onAction={handleAction} balanceMeter={balanceMeter} />
      <main style={{ flex: 1, padding: 32 }}>
        <h3>Sandbox AVL Grove</h3>
        <TreeCanvas trees={trees} tensionNodes={tensionNodes} />
        {showStructure && <pre style={{ background: '#f0fff0', padding: 12 }}>{JSON.stringify(avl.getTreeStructure(), null, 2)}</pre>}
      </main>
    </div>
  );
}
