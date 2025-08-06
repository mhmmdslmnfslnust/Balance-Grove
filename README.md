# 🌳 Balance Grove

A mystical forest puzzle game where players plant and prune trees to maintain harmony. Built with React and based on AVL tree logic, but visualized with abstract, nature-themed graphics.

## 🎮 Game Overview

Balance Grove is an educational puzzle game that teaches AVL tree concepts through an intuitive, nature-themed interface. Players interact with a magical forest where trees automatically balance themselves through natural forces (rotations), but strategic planting and pruning is required to maintain harmony.

## 🌟 Features

### Game Modes

1. **🧩 Puzzle Mode**: Solve carefully crafted challenges with limited moves
   - Multiple difficulty levels
   - Specific objectives per level
   - Strategic thinking required

2. **♾️ Endless Mode**: Keep the grove balanced as nature grows wilder
   - Increasing difficulty over time
   - Auto-planting trees at accelerating intervals
   - Score-based gameplay with high scores

3. **🔬 Sandbox Mode**: Explore and experiment with tree mechanics freely
   - No pressure or time limits
   - Educational insights and tree structure visualization
   - Preset grove configurations
   - Perfect for learning AVL tree concepts

### Visual Features

- 🌿 **Nature-themed graphics**: Trees, roots, and organic connections
- 🌪️ **Tension indicators**: Visual warnings when grove becomes imbalanced
- ⚡ **Smooth animations**: Trees sway and shift during rebalancing
- 📊 **Balance meter**: Real-time harmony visualization
- 🎨 **Abstract design**: No numeric values or tree structure exposed (except in Sandbox mode)

### Educational Elements

- **AVL Tree Logic**: Automatic balancing through rotations
- **Balance Factor**: Visual representation of tree height differences
- **Strategic Thinking**: Understanding when and where to plant/prune
- **Pattern Recognition**: Learning optimal tree arrangements

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mhmmdslmnfslnust/Balance-Grove.git
   cd Balance-Grove
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## 🎯 How to Play

### Basic Controls

- **🌱 Plant Tree**: Add a new tree to the grove
- **✂️ Prune Tree**: Remove a selected tree
- **🔍 Inspect Grove**: View current balance status
- **🔄 Reset Grove**: Start over (Puzzle/Sandbox modes)

### Game Mechanics

1. **Planting**: Click the Plant button, then click anywhere in the grove
2. **Pruning**: Click the Prune button, then click on a tree to remove it
3. **Balance**: Keep the balance factor ≤ 1 for optimal harmony
4. **Rotations**: Trees automatically rearrange when severely imbalanced

### Winning Conditions

- **Puzzle Mode**: Achieve balance within the move limit
- **Endless Mode**: Survive as long as possible without critical imbalance
- **Sandbox Mode**: No win condition - explore freely!

## 🏗️ Technical Architecture

### Project Structure

```
src/
├── components/
│   ├── TreeCanvas.js      # SVG-based tree visualization
│   └── ControlPanel.js    # Game controls and balance meter
├── pages/
│   ├── HomePage.js        # Landing page with mode selection
│   ├── puzzleMode.js      # Puzzle game mode
│   ├── endlessMode.js     # Endless survival mode
│   └── sandboxMode.js     # Free exploration mode
├── utils/
│   ├── AVLTree.js         # Core AVL tree logic
│   └── GameContext.js     # React context for game state
├── App.js                 # Main app with routing
└── index.js               # React entry point
```

### Key Technologies

- **React 18**: Modern component-based UI
- **React Router**: Client-side routing between game modes
- **React Context**: Global game state management
- **SVG Graphics**: Scalable tree visualizations with animations
- **CSS3**: Modern styling with animations and transitions

### AVL Tree Implementation

The core game logic implements a complete AVL tree with:
- **Insertion**: `insertTree(value)` with automatic balancing
- **Deletion**: `deleteTree(value)` with tree restructuring
- **Rotations**: Left and right rotations for balance maintenance
- **Balance Calculation**: Real-time balance factor monitoring
- **Tree Traversal**: Inorder positioning for visual layout

## 🎨 Design Philosophy

### Abstract Visualization

- **No Numbers**: Trees are identified by position and color, not numeric values
- **Organic Layout**: Curved connections mimicking roots and vines
- **Natural Metaphors**: Wind effects, tension clouds, harmony indicators
- **Peaceful Aesthetic**: Calming colors and smooth animations

### Educational Focus

- **Progressive Learning**: Start with simple puzzles, advance to complex scenarios
- **Visual Feedback**: Immediate indication of balance/imbalance
- **Hands-on Experience**: Learn by doing rather than theoretical study
- **Optional Complexity**: Structure view available for advanced learners

## 🔧 Development

### Available Scripts

- `npm start`: Development server with hot reload
- `npm test`: Run test suite
- `npm run build`: Production build
- `npm run eject`: Eject from Create React App

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📚 Learning Resources

### AVL Trees

- [AVL Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)
- [Algorithm Explanation](https://en.wikipedia.org/wiki/AVL_tree)
- [Interactive Tutorial](https://visualgo.net/en/bst)

### React Development

- [React Documentation](https://reactjs.org/docs)
- [React Router Guide](https://reactrouter.com)
- [React Context API](https://reactjs.org/docs/context.html)

## 🐛 Known Issues

- Minor ESLint warnings (non-breaking)
- Performance optimization needed for very large trees (>50 nodes)
- Mobile responsiveness can be improved

## 🗺️ Roadmap

### Near Term
- [ ] Mobile-responsive design
- [ ] Sound effects and music
- [ ] More puzzle levels
- [ ] Achievement system

### Long Term
- [ ] Multiplayer mode
- [ ] Level editor
- [ ] Alternative tree structures (Red-Black, B-trees)
- [ ] Save/load functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by educational algorithm visualization tools
- Built with Create React App
- Tree graphics inspired by nature and organic design principles
- AVL tree algorithm based on Adelson-Velsky and Landis' work

---

**Enjoy balancing your grove! 🌳✨**
