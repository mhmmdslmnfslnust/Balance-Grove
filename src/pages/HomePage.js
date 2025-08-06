// HomePage.js
// Landing page with mode selection
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="homepage">
      <h1>🌳 Balance Grove 🌳</h1>
      <p className="subtitle">
        A mystical forest where harmony depends on the ancient art of tree balance.
        Plant and prune wisely to maintain the grove's equilibrium.
      </p>
      
      <div className="mode-cards">
        <Link to="/puzzle" className="mode-card">
          <h3>🧩 Puzzle Mode</h3>
          <p>Solve carefully crafted challenges with limited moves</p>
          <ul className="features">
            <li>Strategic thinking required</li>
            <li>Multiple difficulty levels</li>
            <li>Perfect for learning balance</li>
          </ul>
        </Link>

        <Link to="/endless" className="mode-card">
          <h3>♾️ Endless Mode</h3>
          <p>Keep the grove balanced as nature grows wilder</p>
          <ul className="features">
            <li>Increasing difficulty</li>
            <li>Test your reflexes</li>
            <li>Compete for high scores</li>
          </ul>
        </Link>

        <Link to="/sandbox" className="mode-card">
          <h3>🔬 Sandbox Mode</h3>
          <p>Explore and experiment with tree mechanics freely</p>
          <ul className="features">
            <li>No pressure or limits</li>
            <li>Educational insights</li>
            <li>Perfect for experimentation</li>
          </ul>
        </Link>
      </div>
    </div>
  );
}
