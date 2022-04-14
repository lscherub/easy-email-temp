import React, { useCallback, useEffect, useRef } from 'react';
import { BlockType, getChildIdx } from 'easy-email-core';
import { useHoverIdx } from '@/hooks/useHoverIdx';
import { isUndefined } from 'lodash';
import { useBlock } from '@/hooks/useBlock';
import { store } from '@/store';
import { observer } from 'mobx-react-lite';

export type BlockAvatarWrapperProps = {
  type: BlockType | string;
  payload?: any;
  action?: 'add' | 'move';
  hideIcon?: boolean;
  idx?: string;
};

export const BlockAvatarWrapper: React.FC<BlockAvatarWrapperProps> = observer((
  props
) => {
  const { type, children, payload, action = 'add', idx } = props;
  const { addBlock, moveBlock } = useBlock();
  const { setIsDragging, setHoverIdx } = useHoverIdx();

  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback(
    (ev: React.DragEvent) => {
      if (action === 'add') {
        store.blockState.setDataTransfer({
          type: type,
          action,
          payload,
        });
      } else {
        store.blockState.setDataTransfer({
          type: type,
          action,
          sourceIdx: idx,
        });
      }

      setIsDragging(true);
    },
    [action, idx, payload, setIsDragging, type]
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setHoverIdx('');
    const { dataTransfer } = store.blockState;
    if (!dataTransfer) return;
    if (action === 'add' && !isUndefined(dataTransfer.parentIdx)) {
      addBlock({
        type,
        parentIdx: dataTransfer.parentIdx,
        positionIndex: dataTransfer.positionIndex,
        payload,
      });
    } else {
      if (
        idx &&
        !isUndefined(dataTransfer.sourceIdx) &&
        !isUndefined(dataTransfer.parentIdx) &&
        !isUndefined(dataTransfer.positionIndex)
      ) {
        moveBlock(
          dataTransfer.sourceIdx,
          getChildIdx(dataTransfer.parentIdx, dataTransfer.positionIndex)
        );
      }
    }
  }, [action, addBlock, idx, moveBlock, payload, setHoverIdx, setIsDragging, type]);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    ele.addEventListener('dragend', onDragEnd);
    return () => {
      ele.removeEventListener('dragend', onDragEnd);
    };
  }, [onDragEnd]);

  return (
    <div
      style={{ cursor: 'grab' }}
      ref={ref}
      onMouseDown={() => {
        window.getSelection()?.removeAllRanges();
      }}
      data-type={type}
      onDragStart={onDragStart}
      draggable
    >
      {children}
    </div>
  );
});
