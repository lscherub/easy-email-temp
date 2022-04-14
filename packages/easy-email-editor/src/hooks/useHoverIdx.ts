import { useEffect, useState } from 'react';
import { store } from '@/store';
import { autorun } from 'mobx';

export function useHoverIdx() {
  const [hoverIdx, setHoverIdx] = useState(store.blockState.hoverIdx);
  const [isDragging, setIsDragging] = useState(store.blockState.isDragging);
  const [direction, setDirection] = useState(store.blockState.direction);

  useEffect(() => {
    const disposer = autorun(() => {
      setHoverIdx(store.blockState.hoverIdx);
      setIsDragging(store.blockState.isDragging);
      setDirection(store.blockState.direction);
    });
    return disposer;
  }, []);

  return {
    hoverIdx,
    setHoverIdx: store.blockState.setHoverIdx,
    isDragging,
    setIsDragging: store.blockState.setIsDragging,
    direction,
    setDirection: store.blockState.setDirection,
  };
}
