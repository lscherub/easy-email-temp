import { BasicType } from 'easy-email-core';
import { cloneDeep, debounce, get } from 'lodash';
import { useCallback } from 'react';
import {
  IBlockData,
  getIndexByIdx,
  getPageIdx,
  getParentByIdx,
  getParentIdx,
  getValueByIdx,
  BlockManager,
  createBlockDataByType,
} from 'easy-email-core';

import { IEmailTemplate } from '@/typings';
import { useEditorProps } from './useEditorProps';
import { scrollBlockEleIntoView } from '@/utils';
import { store } from '@/store';

export function useBlock() {
  const { autoComplete } = useEditorProps();

  const focusBlock = get(store.block.data, store.blockState.focusIdx);

  const addBlock = useCallback(
    (params: {
      type: string;
      parentIdx: string;
      positionIndex?: number;
      payload?: any;
      canReplace?: boolean;
    }) => {
      const start = console.time();

      let { type, parentIdx, positionIndex, payload } = params;
      let nextFocusIdx: string;
      const values = cloneDeep(store.block.data) as IEmailTemplate;
      const parent = get(values, parentIdx) as IBlockData | null;
      if (!parent) {
        console.error(`Invalid ${type} block`);
        return;
      }

      let child = createBlockDataByType(type, payload);

      if (typeof positionIndex === 'undefined') {
        positionIndex = parent.children.length;
      }
      nextFocusIdx = `${parentIdx}.children.[${positionIndex}]`;
      const block = BlockManager.getBlockByType(type);
      if (!block) {
        console.error(`Invalid ${type} block`);
        return;
      }
      const parentBlock = BlockManager.getBlockByType(parent.type)!;

      if (autoComplete) {
        const autoCompletePaths = BlockManager.getAutoCompletePath(
          type,
          parent.type
        );
        if (autoCompletePaths) {
          autoCompletePaths.forEach((item) => {
            child = createBlockDataByType(item, {
              children: [child],
            });
            nextFocusIdx += '.children.[0]';
          });
        }
      }

      // Replace
      if (params.canReplace) {
        const parentIndex = getIndexByIdx(parentIdx);
        const upParent = getParentByIdx(values, parentIdx);
        if (upParent) {
          upParent.children.splice(parentIndex, 1, child);

          return store.block.update(getParentIdx(parentIdx)!, { ...upParent });
        }
      }

      const fixedBlock = BlockManager.getBlockByType(child.type);
      if (!fixedBlock?.validParentType.includes(parent.type)) {
        console.error(
          `${block.type} cannot be used inside ${
            parentBlock.type
          }, only inside: ${block.validParentType.join(', ')}`
        );
        return;
      }

      parent.children.splice(positionIndex, 0, child);
      console.timeLog();
      store.block.update(parentIdx, parent); // listeners not notified
      store.blockState.setFocusIdx(nextFocusIdx);
      scrollBlockEleIntoView({
        idx: nextFocusIdx,
      });
      console.timeEnd();
    },
    [autoComplete]
  );

  const moveBlock = useCallback(
    (sourceIdx: string, destinationIdx: string) => {
      if (sourceIdx === destinationIdx) return null;

      let nextFocusIdx: string;

      const values = cloneDeep(store.block.data) as IEmailTemplate;
      const source = getValueByIdx(values, sourceIdx)!;
      const sourceParentIdx = getParentIdx(sourceIdx);
      const destinationParentIdx = getParentIdx(destinationIdx);
      if (!sourceParentIdx || !destinationParentIdx) return;
      const sourceParent = getValueByIdx(values, sourceParentIdx)!;
      const destinationParent = getValueByIdx(values, destinationParentIdx)!;

      const sourceIndex = getIndexByIdx(sourceIdx);
      let [removed] = sourceParent.children.splice(sourceIndex, 1);
      if (autoComplete) {
        const autoCompletePaths = BlockManager.getAutoCompletePath(
          source.type,
          destinationParent.type
        );
        if (autoCompletePaths) {
          autoCompletePaths.forEach((item) => {
            removed = createBlockDataByType(item, {
              children: [removed],
            });
            nextFocusIdx += '.children.[0]';
          });
        } else {
          console.error('Something when wrong');
        }
      }

      const positionIndex = getIndexByIdx(destinationIdx);
      if (sourceParent === destinationParent) {
        destinationParent.children.splice(positionIndex, 0, removed);

        nextFocusIdx =
          destinationParentIdx +
          `.children.[${destinationParent.children.findIndex(
            (item: IBlockData) => item === removed
          )}]`;
      } else {
        destinationParent.children.splice(positionIndex, 0, removed);
        nextFocusIdx = destinationIdx;
      }

      store.block.update(getPageIdx(), { ...values.content });

      setTimeout(() => {
        store.blockState.setFocusIdx(nextFocusIdx);
      }, 50);

      scrollBlockEleIntoView({
        idx: nextFocusIdx,
      });
    },
    [autoComplete]
  );

  const copyBlock = useCallback((idx: string) => {
    let nextFocusIdx: string;
    const values = cloneDeep(store.block.data);

    const parentIdx = getParentIdx(idx);
    if (!parentIdx) return;
    const parent = get(values, getParentIdx(idx) || '') as IBlockData | null;
    if (!parent) {
      console.error('Invalid block');
      return;
    }
    const copyBlock = cloneDeep(get(values, idx));
    const index = getIndexByIdx(idx) + 1;

    parent.children.splice(index, 0, copyBlock);
    store.block.update(parentIdx, parent);
    nextFocusIdx = `${parentIdx}.children.[${index}]`;

    store.blockState.setFocusIdx(nextFocusIdx);
  }, []);

  const removeBlock = useCallback((idx: string) => {
    let nextFocusIdx: string;
    const values = cloneDeep(store.block.data) as IEmailTemplate;

    const block = getValueByIdx(values, idx);
    if (!block) {
      console.error('Invalid block');
      return;
    }
    const parentIdx = getParentIdx(idx);
    const parent = get(values, getParentIdx(idx) || '') as IBlockData | null;
    const blockIndex = getIndexByIdx(idx);
    if (!parentIdx || !parent) {
      if (block.type === BasicType.PAGE) {
        console.error('Page node can not remove');
        return;
      }
      console.error('Invalid block');
      return;
    }
    nextFocusIdx = parentIdx;

    parent.children.splice(blockIndex, 1);
    store.block.update(parentIdx, parent);
    store.blockState.setFocusIdx(nextFocusIdx);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setValueByIdx = useCallback(
    debounce(<T extends IBlockData>(idx: string, newVal: T) => {
      store.block.update(idx, {
        ...newVal,
      });
    }),
    []
  );

  const isExistBlock = useCallback((idx: string) => {
    return Boolean(get(store.block.data, idx));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFocusBlock = useCallback(
    debounce((val) => {
      store.block.update(store.blockState.focusIdx, { ...val });
    }),
    [focusBlock]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFocusBlockValue = useCallback(
    debounce((val) => {
      if (!focusBlock) return;
      focusBlock.data.value = val;
      store.block.update(store.blockState.focusIdx, { ...focusBlock });
    }),
    [focusBlock]
  );

  return {
    focusBlock,
    setFocusBlock,
    setFocusBlockValue,
    setValueByIdx,
    addBlock,
    moveBlock,
    copyBlock,
    removeBlock,
    isExistBlock,
  };
}
