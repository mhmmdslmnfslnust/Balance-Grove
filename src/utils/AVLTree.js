// AVLTree.js
// Backend AVL logic for Balance Grove

class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

export default class AVLTree {
  constructor() {
    this.root = null;
  }

  // Helper to get height
  getHeight(node) {
    if (!node) return 0;
    return node.height;
  }

  // Helper to get balance factor
  getBalanceFactor(node = this.root) {
    if (!node) return 0;
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  // Right rotate
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  // Left rotate
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  // Insert value
  insertTree(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (!node) return new AVLNode(value);
    if (value < node.value) node.left = this._insert(node.left, value);
    else if (value > node.value) node.right = this._insert(node.right, value);
    else return node;
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalanceFactor(node);
    // Left Left
    if (balance > 1 && value < node.left.value) return this.rightRotate(node);
    // Right Right
    if (balance < -1 && value > node.right.value) return this.leftRotate(node);
    // Left Right
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    // Right Left
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    return node;
  }

  // Delete value
  deleteTree(value) {
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (!node) return node;
    if (value < node.value) node.left = this._delete(node.left, value);
    else if (value > node.value) node.right = this._delete(node.right, value);
    else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        let temp = this._minValueNode(node.right);
        node.value = temp.value;
        node.right = this._delete(node.right, temp.value);
      }
    }
    if (!node) return node;
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalanceFactor(node);
    // Left Left
    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rightRotate(node);
    // Left Right
    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    // Right Right
    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.leftRotate(node);
    // Right Left
    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    return node;
  }

  _minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  // Get tree structure for visualization
  getTreeStructure() {
    return this._getStructure(this.root);
  }

  _getStructure(node) {
    if (!node) return null;
    return {
      value: node.value,
      left: this._getStructure(node.left),
      right: this._getStructure(node.right),
      height: node.height
    };
  }
}
