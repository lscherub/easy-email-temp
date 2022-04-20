import { store } from '@/store';

export function useRecord() {
  const { redo, undo, redoable, undoable } = store.record;
  return {
    redo,
    undo,
    redoable,
    undoable,
  };
}
