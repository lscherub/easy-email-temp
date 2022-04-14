import { store } from '@/store';
import { autorun } from 'mobx';
import { useState } from 'react';
import { useEffect } from 'react';

export function useFocusIdx() {
  const [focusIdx, setFocusIdx] = useState(store.blockState.focusIdx);

  useEffect(() => {
    const disposer = autorun(() => {
      setFocusIdx(store.blockState.focusIdx);
    });
    return disposer;
  }, []);

  return {
    focusIdx,
    setFocusIdx: store.blockState.setFocusIdx,
  };
}
