import { store } from '@/store';
import { useObserver } from 'mobx-react-lite';

export function useStateHelper() {
  return useObserver(() => ({
    setHoverIdx: store.blockState.setHoverIdx,
    setIsDragging: store.blockState.setIsDragging,
    setDirection: store.blockState.setDirection,
    setFocusIdx: store.blockState.setFocusIdx,
  }));
}
