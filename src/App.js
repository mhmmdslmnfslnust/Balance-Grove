// App.js
// Main entry point with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './utils/GameContext';
import HomePage from './pages/HomePage';
import PuzzleMode from './pages/puzzleMode';
import EndlessMode from './pages/endlessMode';
import SandboxMode from './pages/sandboxMode';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/puzzle" element={<PuzzleMode />} />
            <Route path="/endless" element={<EndlessMode />} />
            <Route path="/sandbox" element={<SandboxMode />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
