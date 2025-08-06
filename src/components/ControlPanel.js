// ControlPanel.js
// Sidebar for user actions with balance meter
import React from 'react';
import { Link } from 'react-router-dom';

function BalanceMeter({ balanceFactor, maxFactor = 3 }) {
  const percentage = Math.min((balanceFactor / maxFactor) * 100, 100);
  
  let meterClass = 'balanced';
  let meterText = 'Balanced';
  
  if (balanceFactor > 1) {
    meterClass = balanceFactor > 2 ? 'critical' : 'tension';
    meterText = balanceFactor > 2 ? 'Critical!' : 'Tension';
  }
  
  return (
    <div className="balance-meter-container">
      <div className="balance-meter-label">
        Grove Balance: <strong>{meterText}</strong>
      </div>
      <div className="balance-meter">
        <div 
          className={`balance-fill ${meterClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#666' }}>
        {balanceFactor === 0 ? 'Perfect harmony' : 
         balanceFactor === 1 ? 'Slight imbalance' :
         balanceFactor === 2 ? 'Noticeable tension' : 'Needs attention!'}
      </div>
    </div>
  );
}

export default function ControlPanel({ 
  mode, 
  balanceFactor, 
  onAction, 
  moves = 0,
  maxMoves = null,
  gameWon = false,
  gameStats = null
}) {
  return (
    <aside className="control-panel">
      {/* Navigation */}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ color: '#6b8e23', textDecoration: 'none', fontSize: '1.2rem' }}>
          ← Back to Menu
        </Link>
      </div>

      <h2>🌳 Balance Grove</h2>
      
      <div className="mode-indicator">
        {mode} Mode
      </div>

      <BalanceMeter balanceFactor={balanceFactor} />

      {/* Game stats */}
      {gameStats && (
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {gameStats.score && <div>Score: {gameStats.score}</div>}
          {gameStats.time && <div>Time: {gameStats.time}s</div>}
          {gameStats.difficulty && <div>Difficulty: {gameStats.difficulty.toFixed(1)}</div>}
        </div>
      )}

      {/* Move counter for puzzle mode */}
      {maxMoves && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <strong>Moves: {moves} / {maxMoves}</strong>
          {gameWon && (
            <div style={{ color: '#6b8e23', fontWeight: 'bold', marginTop: '0.5rem' }}>
              🎉 Grove Balanced! 🎉
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="action-buttons">
        <button 
          className="action-button" 
          onClick={() => onAction('plant')}
          disabled={gameWon && maxMoves}
        >
          🌱 Plant Tree
        </button>
        
        <button 
          className="action-button" 
          onClick={() => onAction('prune')}
          disabled={gameWon && maxMoves}
        >
          ✂️ Prune Tree
        </button>
        
        <button 
          className="action-button" 
          onClick={() => onAction('inspect')}
        >
          🔍 Inspect Grove
        </button>
        
        {mode === 'Sandbox' && (
          <button 
            className="action-button" 
            onClick={() => onAction('toggle-structure')}
          >
            📊 Toggle Structure
          </button>
        )}
        
        {(mode === 'Puzzle' || mode === 'Sandbox') && (
          <button 
            className="action-button" 
            onClick={() => onAction('reset')}
            style={{ background: '#dc3545' }}
          >
            🔄 Reset Grove
          </button>
        )}
      </div>

      {/* Game tips */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
        <strong>🌿 Tips:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li>Plant trees to grow the grove</li>
          <li>Prune to remove excess growth</li>
          <li>Keep the grove balanced for harmony</li>
          <li>Watch for tension indicators</li>
        </ul>
      </div>
    </aside>
  );
}
