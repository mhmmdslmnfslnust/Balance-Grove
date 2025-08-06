// sandboxMode.js
// Sandbox mode page for free exploration
import React, { useState } from 'react';
import { useGame } from '../utils/GameContext';
import TreeCanvas from '../components/TreeCanvas';
import ControlPanel from '../components/ControlPanel';

export default function SandboxMode() {
  const {
    treeStructure,
    balanceFactor,
    plantTree,
    pruneTree,
    resetTree
  } = useGame();

  const [showStructure, setShowStructure] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    if (action === 'plant') {
      setSelectedAction('plant');
    } else if (action === 'prune') {
      setSelectedAction('prune');
    } else if (action === 'reset') {
      resetTree();
      setSelectedAction(null);
    } else if (action === 'inspect') {
      alert(`Grove Analysis:\nBalance Factor: ${balanceFactor}\nStructure: ${treeStructure ? 'Present' : 'Empty'}\nNodes: ${countNodes(treeStructure)}`);
    } else if (action === 'toggle-structure') {
      setShowStructure(!showStructure);
    }
  };

  const handleTreeClick = (value) => {
    if (selectedAction === 'plant') {
      // Plant a new random tree
      plantTree();
      setSelectedAction(null);
    } else if (selectedAction === 'prune' && value) {
      pruneTree(value);
      setSelectedAction(null);
    }
  };

  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  const getTreeHeight = (node) => {
    if (!node) return 0;
    return node.height;
  };

  const presetGroves = [
    { name: 'Simple Grove', values: [10, 5, 15] },
    { name: 'Unbalanced Left', values: [30, 20, 10] },
    { name: 'Unbalanced Right', values: [10, 20, 30] },
    { name: 'Complex Grove', values: [50, 25, 75, 12, 37, 62, 87] },
    { name: 'Sequential', values: [1, 2, 3, 4, 5, 6, 7] }
  ];

  const loadPreset = (preset) => {
    resetTree();
    preset.values.forEach(value => plantTree(value));
    setSelectedAction(null);
  };

  return (
    <div className="game-container">
      <ControlPanel 
        mode="Sandbox" 
        balanceFactor={balanceFactor}
        onAction={handleAction}
      />
      
      <main className="main-content">
        <div style={{ marginBottom: '1rem' }}>
          <h2>🔬 Sandbox Grove</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Experiment freely with tree planting and pruning. Learn how AVL trees maintain balance!
          </p>
        </div>

        {/* Preset groves */}
        <div style={{ marginBottom: '1rem' }}>
          <h4>Quick Start Presets:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {presetGroves.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset)}
                className="action-button"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {selectedAction && (
          <div style={{ 
            background: '#e3f2fd', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '2px solid #2196f3'
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

        {/* Grove statistics */}
        <div style={{ 
          marginTop: '1rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
            <h4>Grove Statistics</h4>
            <p>Total Trees: {countNodes(treeStructure)}</p>
            <p>Tree Height: {getTreeHeight(treeStructure)}</p>
            <p>Balance Factor: {balanceFactor}</p>
            <p>Status: {balanceFactor <= 1 ? '✅ Balanced' : '⚠️ Imbalanced'}</p>
          </div>

          {showStructure && treeStructure && (
            <div style={{ background: '#f0fff0', padding: '1rem', borderRadius: '8px' }}>
              <h4>Tree Structure (Educational)</h4>
              <pre style={{ 
                fontSize: '0.8rem', 
                overflow: 'auto', 
                maxHeight: '200px',
                background: 'white',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                {JSON.stringify(treeStructure, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Educational content */}
        <div style={{ 
          marginTop: '2rem', 
          background: '#fff9c4', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '2px solid #fbc02d'
        }}>
          <h4>🎓 Learning Notes</h4>
          <ul style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <li><strong>AVL Trees</strong> automatically balance themselves when nodes are added or removed</li>
            <li><strong>Balance Factor</strong> is the height difference between left and right subtrees</li>
            <li><strong>Rotations</strong> occur when balance factor exceeds 1, maintaining optimal performance</li>
            <li><strong>Height</strong> determines how many steps it takes to find any tree in the grove</li>
            <li>Try the sequential preset to see dramatic rebalancing in action!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
