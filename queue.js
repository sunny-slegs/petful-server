
'use strict';

class _Node {
  constructor(value) {
    this.value = value,
    this.next = null,
    this.prev = null;
  }
}

class Queue {
  constructor() {
    this.first = null,
    this.last = null;
  }

  enqueue(data) {
    // creat a node with the 'data'
    const node = new _Node(data);
    // if the queue is empty set the node to the first spot
    if (this.first === null) {
      this.first = node;
    } 
    // if there is an item in the last position, reset it to point to the new node
    if (this.last) {
      // set the original last node to point back to new node
      this.last.prev = node;
      // set the new node to point forward to the original last node
      node.next = this.last;
    }
    // set the node to the last spot
    this.last = node;
  }

  dequeue() {
    // if the queue is empty, return nothing
    if (this.first === null) {
      return null;
    }
    // otherwise replace the first item with the second to first item
    const node = this.first;
    this.first = node.prev;
    // if this is the last item, set it to null
    if (node === this.last) {
      this.last = null;
    }
    // return the deleted node's value
    return node.value;
  }

  peek() {
    if (this.first === null) {
      return '';
    }
    return this.first.value;
  }
}

module.exports = Queue;