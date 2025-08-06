// ControlPanel.js
// Sidebar for user actions
import React from 'react';

export default function ControlPanel({ mode, onAction, balanceMeter }) {
  return (
    <aside style={{ width: 220, background: '#f4ffe4', borderLeft: '2px solid #b0e0b0', padding: 20 }}>
      <h2>Balance Grove</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Mode:</strong> {mode}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Balance Meter:</strong>
        <div style={{ height: 18, background: '#e0e0e0', borderRadius: 8, overflow: 'hidden', marginTop: 4 }}>
          <div style={{ width: `${100-balanceMeter*20}%`, height: '100%', background: balanceMeter > 1 ? '#ffb347' : '#8fbc8f', transition: 'width 0.5s' }} />
        </div>
      </div>
      <button onClick={() => onAction('plant')}>Plant Tree</button>
      <button onClick={() => onAction('prune')}>Prune Tree</button>
      <button onClick={() => onAction('inspect')}>Inspect</button>
      <button onClick={() => onAction('forecast')}>Forecast</button>
    </aside>
  );
}
