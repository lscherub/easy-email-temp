import { useRecord } from '@/hooks/useRecord';
import { useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { useBlock } from './useBlock';
import { getEditorRoot, getShadowRoot } from '@/utils';
import { useFocusIdx } from './useFocusIdx';
import { useEditorContext } from './useEditorContext';
import { getNodeIdxFromClassName } from 'easy-email-core';
import { getBlockNodeByChildEle } from '@/utils/getBlockNodeByChildEle';
import { useStateHelper } from './useStateHelper';

function isContentEditFocus() {
  const isShadowRootFocus = document.activeElement === getEditorRoot();
  if (isShadowRootFocus) {
    if (
      getEditorRoot()?.shadowRoot?.activeElement?.getAttribute(
        'contenteditable'
      ) === 'true'
    ) {
      return true;
    }
  } else {
    if (
      ['input', 'textarea'].includes(
        document.activeElement?.tagName.toLocaleLowerCase() || ''
      ) ||
      document.activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return true;
    }
  }
  return false;
}

export function useHotKeys() {
  const { removeBlock } = useBlock();
  const { focusIdx } = useFocusIdx();
  const { setFocusIdx } = useStateHelper();
  const { values } = useEditorContext();
  const { undo, redo } = useRecord();

  // redo/undo
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (isContentEditFocus()) return;
      if (isHotkey('mod+z', ev)) {
        ev.preventDefault();
        undo();
      }
      if (isHotkey('mod+y', ev) || isHotkey('mod+shift+z', ev)) {
        ev.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // delete
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isContentEditFocus()) return;
      // if (isHotkey('delete', ev) || isHotkey('backspace', ev)) {
      //   removeBlock(focusIdx);
      // }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusIdx, removeBlock]);

  // focus
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isHotkey('tab', ev) || isHotkey('shift+tab', ev)) {
        setTimeout(() => {
          const activeElement = getShadowRoot().activeElement;
          if (activeElement instanceof HTMLElement) {
            const blockNode = getBlockNodeByChildEle(activeElement);
            if (blockNode) {
              const idx = getNodeIdxFromClassName(blockNode.classList)!;
              setFocusIdx(idx);
            }
          }
        }, 0);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusIdx, removeBlock, setFocusIdx, values]);
}
