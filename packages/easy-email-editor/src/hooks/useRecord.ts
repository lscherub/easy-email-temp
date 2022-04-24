import { useObserver } from 'mobx-react-lite';
import { store } from '@/store';

export function useRecord() {
  return useObserver(() => {
    const { redo, undo } = store.block;
    const { redoable, undoable, size, index, records } = store.record;
    return {
      redo,
      undo,
      redoable,
      undoable,
      size,
      index,
      records,
    };
  });
}
