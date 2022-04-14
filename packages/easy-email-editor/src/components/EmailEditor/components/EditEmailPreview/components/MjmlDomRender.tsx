import React, { useEffect, useMemo, useState } from 'react';
import mjml from 'mjml-browser';
import { getPageIdx, IPage, JsonToMjml } from 'easy-email-core';
import { cloneDeep } from 'lodash';
import { HtmlStringToReactNodes } from '@/utils/HtmlStringToReactNodes';
import { createPortal } from 'react-dom';
import { useEditorProps } from '@/hooks/useEditorProps';
import { getEditorRoot, getShadowRoot } from '@/utils';
import { DATA_RENDER_COUNT, FIXED_CONTAINER_ID } from '@/constants';
import { store } from '@/store';
import { observer, } from 'mobx-react-lite';
import { autorun, toJS } from 'mobx';

let count = 0;
export const MjmlDomRender = observer(() => {

  const [pageData, setPageData] = useState<IPage | null>(store.block.data.content);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { dashed, mergeTags, enabledMergeTagsBadge } = useEditorProps();
  const [isTextFocus, setIsTextFocus] = useState(false);

  const isTextFocusing =
    document.activeElement === getEditorRoot() &&
    getShadowRoot().activeElement?.getAttribute('contenteditable') === 'true';

  useEffect(() => {

    const disposer = autorun(() => {
      const content = store.block.data.content;
      if (!isTextFocus) {
        setPageData(cloneDeep(toJS(content)));
      }
    });

    return () => {
      disposer();
    };

  }, [isTextFocus]);

  useEffect(() => {
    setIsTextFocus(isTextFocusing);
  }, [isTextFocusing]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (getEditorRoot()?.contains(e.target as Node)) {
        return;
      }
      const fixedContainer = document.getElementById(FIXED_CONTAINER_ID);
      if (fixedContainer?.contains(e.target as Node)) {
        return;
      }
      setIsTextFocus(false);
    };

    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const root = getShadowRoot();
    if (!root) return;
    const onClick = (e: Event) => {
      const isFocusing =
        getShadowRoot().activeElement?.getAttribute('contenteditable') ===
        'true';
      if (isFocusing) {
        setIsTextFocus(true);
      }
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
    };
  }, []);

  const html = useMemo(() => {
    const begin = +new Date();
    if (!pageData) return '';

    const mjmlContent = JsonToMjml({
      data: pageData,
      idx: getPageIdx(),
      context: pageData,
      mode: 'testing',
      dataSource: cloneDeep(mergeTags),
    });
    console.log('JsonToMjml', +new Date() - begin);
    const renderHtml = mjml(
      mjmlContent
    ).html;
    console.log('renderHtml', +new Date() - begin);
    return renderHtml;
  }, [mergeTags, pageData]);

  return useMemo(() => {
    return (
      <div
        {
        ...{
          [DATA_RENDER_COUNT]: count++
        }
        }
        data-dashed={dashed}
        ref={setRef}
        style={{
          outline: 'none',
          position: 'relative',
        }}
        role='tabpanel'
        tabIndex={0}
      >
        {ref &&
          createPortal(
            HtmlStringToReactNodes(html, {
              enabledMergeTagsBadge: Boolean(enabledMergeTagsBadge),
            }),
            ref
          )}
      </div>
    );
  }, [dashed, ref, html, enabledMergeTagsBadge]);
});
