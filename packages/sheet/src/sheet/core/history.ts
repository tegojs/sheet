export default class History {
  undoItems: string[];
  redoItems: string[];
  constructor() {
    this.undoItems = [];
    this.redoItems = [];
  }

  add(data: unknown) {
    this.undoItems.push(JSON.stringify(data));
    this.redoItems = [];
  }

  canUndo() {
    return this.undoItems.length > 0;
  }

  canRedo() {
    return this.redoItems.length > 0;
  }

  undo(currentd: unknown, cb: (data: unknown) => void) {
    if (this.canUndo()) {
      this.redoItems.push(JSON.stringify(currentd));
      cb(JSON.parse(this.undoItems.pop() as string));
    }
  }

  redo(currentd: unknown, cb: (data: unknown) => void) {
    if (this.canRedo()) {
      this.undoItems.push(JSON.stringify(currentd));
      cb(JSON.parse(this.redoItems.pop() as string));
    }
  }
}
