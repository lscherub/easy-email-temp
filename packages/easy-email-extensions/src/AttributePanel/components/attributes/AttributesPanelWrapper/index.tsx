import { IconEye, IconEyeInvisible } from '@arco-design/web-react/icon';
import React, { useCallback } from 'react';
import { Stack, TextStyle, useBlock, useEditorProps } from 'easy-email-editor';
import { observer } from 'mobx-react-lite';
import { BasicType, BlockManager, IBlockData } from 'easy-email-core';

export interface AttributesPanelWrapper {
  style?: React.CSSProperties;
  extra?: React.ReactNode;
}
export const AttributesPanelWrapper: React.FC<AttributesPanelWrapper> = observer((
  props
) => {
  const { focusBlock, setFocusBlock } = useBlock();
  const block = focusBlock && BlockManager.getBlockByType(focusBlock.type);

  if (!focusBlock || !block) return null;

  return (
    <div>
      <div
        style={{
          border: '1px solid var(--color-neutral-3, rgb(229, 230, 235))',
          borderBottom: 'none',
          padding: '12px 24px',
        }}
      >
        <Stack vertical>
          <Stack.Item fill>
            <Stack wrap={false} distribution='equalSpacing' alignment='center'>
              <Stack spacing='extraTight' alignment='center'>
                <EyeIcon setFocusBlock={setFocusBlock} focusBlock={focusBlock} />
                <TextStyle variation='strong' size='large'>
                  {`${block.name} attributes`}
                </TextStyle>
              </Stack>
              <Stack.Item>{props.extra}</Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>

      <div style={{ padding: '0px', ...props.style }}>{props.children}</div>
    </div>
  );
});

function EyeIcon({ focusBlock, setFocusBlock }: { focusBlock: IBlockData; setFocusBlock: (blockData: IBlockData) => void; }) {

  const onToggleVisible = useCallback(
    (e: React.MouseEvent) => {
      if (!focusBlock) return null;
      e.stopPropagation();
      setFocusBlock({
        ...focusBlock,
        data: {
          ...focusBlock.data,
          hidden: !focusBlock.data.hidden,
        },
      });
    },
    [focusBlock, setFocusBlock]
  );

  if (!focusBlock) return null;

  if (focusBlock.type === BasicType.PAGE) return null;

  return focusBlock.data.hidden ? (
    <IconEyeInvisible
      style={{ cursor: 'pointer', fontSize: 18 }}
      onClick={onToggleVisible}
    />
  ) : (
    <IconEye
      style={{ cursor: 'pointer', fontSize: 18 }}
      onClick={onToggleVisible}
    />
  );
}
