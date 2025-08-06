// TreeCanvas.js
// Draws the magical forest using SVG
import React from 'react';

const TREE_COLORS = ['#6B8E23', '#228B22', '#2E8B57', '#8FBC8F'];

function Tree({ x, y, tension, animate, id }) {
  // Abstract tree: trunk, canopy, tension effect
  return (
    <g>
      <rect x={x-5} y={y} width={10} height={30} fill="#8B5A2B" rx={3} />
      <ellipse cx={x} cy={y} rx={18} ry={22} fill={TREE_COLORS[id % TREE_COLORS.length]} style={{ filter: tension ? 'brightness(0.7)' : 'none', transition: 'filter 0.5s' }} />
      {tension && <ellipse cx={x} cy={y-10} rx={22} ry={8} fill="#555" opacity={0.3} />}
      {animate && <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -10" dur="0.5s" repeatCount="1" />}
    </g>
  );
}

export default function TreeCanvas({ trees, tensionNodes, onTreeClick }) {
  // trees: [{x, y, id}]
  // tensionNodes: [id]
  return (
    <svg width="100%" height="400" viewBox="0 0 800 400" style={{ background: 'linear-gradient(#e0ffe0, #b0e0b0)' }}>
      {trees.map((tree, idx) => (
        <Tree key={tree.id} x={tree.x} y={tree.y} id={tree.id} tension={tensionNodes.includes(tree.id)} animate={tree.animate} />
      ))}
    </svg>
  );
}
