import { useObserver } from 'mobx-react-lite';
import { store } from '@/store';

export function useHoverIdx() {
  return useObserver(() => ({
    hoverIdx: store.blockState.hoverIdx,
    isDragging: store.blockState.isDragging,
    direction: store.blockState.direction,
    dataTransfer: store.blockState.dataTransfer,
  }));
}
