const { readFile } = require('fs');
const Node = require('../Btree/Nodos');
const { Console } = require('console');
class BTree {
  constructor(order) {
    this.root = null; // Inicialmente, el árbol está vacío
    this.order = order; // Almacena el orden del árbol
  }

  insert(key) {
    if (this.root === null) {
      this.root = new Node([key], []);
    } else {
      this._insert(key, this.root);
    }
  }

  _insert(key, node) {
    if (node.keys.length < this.order - 1) {
      this._insertKey(key, node);
    } else {
      const medianIndex = Math.floor((this.order - 1) / 2);
      const median = node.keys[medianIndex];
      const leftKeys = node.keys.slice(0, medianIndex);
      const rightKeys = node.keys.slice(medianIndex + 1);
      const leftChildren = node.children.slice(0, medianIndex + 1);
      const rightChildren = node.children.slice(medianIndex + 1);
      const newNode = new Node([median], [
        new Node(leftKeys, leftChildren),
        new Node(rightKeys, rightChildren)
      ]);
      if (key < median) {
        this._insert(key, newNode.children[0]);
      } else {
        this._insert(key, newNode.children[1]);
      }
      this.root = newNode;
    }
  }

  _insertKey(key, node) {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }
    node.keys = [
      ...node.keys.slice(0, i),
      key,
      ...node.keys.slice(i)
    ];
    node.children = [
      ...node.children.slice(0, i + 1),
      new Node([], []),
      ...node.children.slice(i + 1)
    ];
  }

  search(key) {
    return this._search(key, this.root);
  }

  _search(key, node) {
    if (node === null || node == undefined ) {
      console.log("No existe");
      return false;
    }
    let i = 0;
    while (i < node.keys.length && key != node.keys[i]["key"]) {
      i++;
    }
    if (i < node.keys.length && key === node.keys[i]["key"]) {
      console.log("Se encontro a", key );
      console.log(node.keys[i]["value"])
      
      return true;
    }
    return this._search(key, node.children[i]);
  }

  delete(key) {
      return this._delete(key, this.root);
  }

  _delete(key, node) {
    if (node === null || node == undefined ) {
      return false;
    }
    let i = 0;
      while (i < node.keys.length && key != node.keys[i]["Key"]) {
        i++;
      }
      if (i < node.keys.length && key === node.keys[i]["Key"]) {
        debugger
        if (node.children[i].keys.length >= this.order) {
          const predecessor = this._getPredecessor(node.children[i]);
          node.keys[i]["key"] = predecessor;
          this._delete(predecessor, node.children[i]);
        } else if (node.children[i + 1].keys.length >= this.order) {
          const successor = this._getSuccessor(node.children[i + 1]);
          node.keys[i]["key"] = successor;
          this._delete(successor, node.children[i + 1]);
        } else {
          this._merge(node, i);
          this._delete(key, node.children[i]);
        }
      } else {
        return this._delete(key, node.children[i]);
    }
  }
  
  patch(key, newvalue) {
    return this._patch(key, this.root, newvalue);
  }

  _patch(key, node, newvalue){
    if (node === null || node == undefined ) {
      return false;
    }

    let i = 0;
    while (i < node.keys.length && key != node.keys[i]["key"]) {
      i++;
    }
    if (i < node.keys.length && key === node.keys[i]["key"]) {
        
        const newdata = newvalue;
        for (const key in newdata) {
          if (newdata.hasOwnProperty(key)) {
            node.keys[i]["value"][key] = newdata[key];
          }
        }
      return true;
    }
    return this._patch(key, node.children[i], newvalue);
  }
  
  compressLZ78(input) {
    let dictionary = new Map();
    let compressed = [];
    let currentPhrase = "";
    let currentIndex = 0;
  
    for (let i = 0; i < input.length; i++) {
      currentPhrase += input[i];
      if (!dictionary.has(currentPhrase)) {
        // Agregar la nueva entrada al diccionario
        dictionary.set(currentPhrase, currentIndex++);
        let indexid = 0;
        if(dictionary.get(currentPhrase.slice(0,-1)) != null){
          indexid = dictionary.get(currentPhrase.slice(0,-1));
          indexid = indexid + 1;
        }
        // Agregar la referencia al diccionario
        compressed.push([indexid, input[i]]);
        // Reiniciar la frase actual
        currentPhrase = "";
      }
    }
  
    return compressed;
  }
  
}

module.exports = BTree;
