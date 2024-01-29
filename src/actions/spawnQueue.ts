export interface PriorityQueueItem {
  priority: number;
  value: any;
}

interface PriorityQueue {
  enqueue: (item: PriorityQueueItem) => void;
  dequeue: () => PriorityQueueItem | undefined;
  peek: () => PriorityQueueItem | undefined;
  size: () => number;
}

export default function createPriorityQueue(): PriorityQueue {
  const items: PriorityQueueItem[] = [];

  function enqueue(item: PriorityQueueItem) {
    items.push(item);
    items.sort((a, b) => a.priority - b.priority);
  }

  function dequeue() {
    return items.shift();
  }

  function peek() {
    return items[0];
  }

  function size() {
    return items.length;
  }

  return { enqueue, dequeue, peek, size };
}
