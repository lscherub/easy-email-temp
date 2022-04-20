import { store } from '@/store';
import { useObserver } from 'mobx-react-lite';

export function useFocusIdx() {
  return useObserver(() => ({
    focusIdx: store.blockState.focusIdx,
  }));
}
