// TreeCanvas.js
// Draws the magical forest using SVG
import React, { useMemo } from 'react';

const TREE_COLORS = ['#6B8E23', '#228B22', '#2E8B57', '#8FBC8F', '#32CD32', '#90EE90'];

function Tree({ x, y, tension, animate, id, value, onClick }) {
  const treeColor = TREE_COLORS[Math.abs(value || id) % TREE_COLORS.length];
  
  return (
    <g 
      onClick={() => onClick && onClick(value)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={animate ? 'tree-animate' : ''}
    >
      {/* Tree trunk */}
      <rect 
        x={x-6} 
        y={y+15} 
        width={12} 
        height={25} 
        fill="#8B4513" 
        rx={6}
        style={{ transition: 'all 0.5s ease' }}
      />
      
      {/* Tree canopy */}
      <circle 
        cx={x} 
        cy={y} 
        r={20} 
        fill={treeColor}
        style={{ 
          filter: tension ? 'brightness(0.6) saturate(0.7)' : 'brightness(1)', 
          transition: 'all 0.5s ease',
          stroke: tension ? '#ff6b6b' : 'none',
          strokeWidth: tension ? 2 : 0
        }} 
      />
      
      {/* Inner canopy details */}
      <circle 
        cx={x-5} 
        cy={y-3} 
        r={8} 
        fill={treeColor}
        opacity={0.7}
        style={{ filter: 'brightness(1.2)' }}
      />
      <circle 
        cx={x+4} 
        cy={y+2} 
        r={6} 
        fill={treeColor}
        opacity={0.8}
        style={{ filter: 'brightness(1.1)' }}
      />
      
      {/* Tension effects */}
      {tension && (
        <>
          <circle cx={x} cy={y-30} r={25} fill="#666" opacity={0.2} />
          <text x={x} y={y-35} textAnchor="middle" fill="#ff6b6b" fontSize={12} fontWeight="bold">
            ⚠️
          </text>
        </>
      )}
      
      {/* Wind animation for tension */}
      {tension && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`-2 ${x} ${y}; 2 ${x} ${y}; -2 ${x} ${y}`}
          dur="1s"
          repeatCount="indefinite"
        />
      )}
    </g>
  );
}

function Connection({ fromX, fromY, toX, toY, tension }) {
  const pathData = `M ${fromX} ${fromY+20} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 + 30} ${toX} ${toY-20}`;
  
  return (
    <path
      d={pathData}
      stroke={tension ? "#8B4513" : "#4A4A4A"}
      strokeWidth={tension ? 4 : 3}
      fill="none"
      strokeDasharray={tension ? "5,5" : "none"}
      opacity={0.7}
      style={{ transition: 'all 0.5s ease' }}
    />
  );
}

export default function TreeCanvas({ treeStructure, balanceFactor, onTreeClick }) {
  const { nodes, connections } = useMemo(() => {
    if (!treeStructure) return { nodes: [], connections: [] };
    
    const nodes = [];
    const connections = [];
    
    // Calculate positions using inorder traversal
    let xPosition = 0;
    const NODE_SPACING = 80;
    const LEVEL_HEIGHT = 80;
    
    function traverse(node, depth = 0, parentX = null, parentY = null) {
      if (!node) return null;
      
      // Traverse left subtree first
      traverse(node.left, depth + 1, null, null);
      
      // Position current node
      const x = xPosition * NODE_SPACING + 100;
      const y = depth * LEVEL_HEIGHT + 60;
      xPosition++;
      
      // Check if this node has tension
      const leftHeight = node.left?.height || 0;
      const rightHeight = node.right?.height || 0;
      const nodeBalance = Math.abs(leftHeight - rightHeight);
      const hasTension = nodeBalance > 1;
      
      nodes.push({
        x,
        y,
        value: node.value,
        id: node.value,
        tension: hasTension,
        animate: false
      });
      
      // Add connection to parent if exists
      if (parentX !== null && parentY !== null) {
        connections.push({
          fromX: parentX,
          fromY: parentY,
          toX: x,
          toY: y,
          tension: hasTension
        });
      }
      
      // Traverse right subtree
      if (node.left) traverse(node.left, depth + 1, x, y);
      if (node.right) traverse(node.right, depth + 1, x, y);
    }
    
    traverse(treeStructure);
    
    return { nodes, connections };
  }, [treeStructure]);
  
  const viewBoxWidth = Math.max(800, nodes.length * 80 + 200);
  
  return (
    <div className="tree-canvas">
      <svg 
        width="100%" 
        height="500" 
        viewBox={`0 0 ${viewBoxWidth} 500`}
        style={{ 
          background: `linear-gradient(135deg, 
            ${balanceFactor > 1 ? '#ffe0e0' : '#e8f5e8'} 0%, 
            ${balanceFactor > 1 ? '#ffcccb' : '#d0f0d0'} 100%)`,
          transition: 'background 0.5s ease'
        }}
      >
        {/* Background elements */}
        <defs>
          <pattern id="grass" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#90EE90" opacity={0.1} />
            <path d="M 0 40 Q 20 30 40 40" stroke="#228B22" strokeWidth="1" fill="none" opacity={0.3} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grass)" />
        
        {/* Connections (roots/vines) */}
        {connections.map((conn, idx) => (
          <Connection key={idx} {...conn} />
        ))}
        
        {/* Trees */}
        {nodes.map((tree) => (
          <Tree 
            key={tree.id} 
            {...tree} 
            onClick={onTreeClick}
          />
        ))}
        
        {/* Balance status indicator */}
        {balanceFactor > 1 && (
          <text 
            x={viewBoxWidth / 2} 
            y={30} 
            textAnchor="middle" 
            fill="#ff6b6b" 
            fontSize={16} 
            fontWeight="bold"
          >
            🌪️ Grove Imbalanced! 🌪️
          </text>
        )}
      </svg>
    </div>
  );
}
