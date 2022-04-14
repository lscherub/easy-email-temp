import { Stack } from '@/components/UI/Stack';
import React from 'react';
import { IconFont } from '@/components/IconFont';
import { Button } from '@/components/UI/Button';
import { store } from '@/store';
import { observer } from 'mobx-react-lite';

export const ToolsPanel = observer(() => {
  const { redo, undo, redoable, undoable } = store.record;

  return (
    <Stack>
      <Button title='undo' disabled={!undoable} onClick={() => undo()}>
        <IconFont
          iconName='icon-undo'
          style={{
            cursor: 'inherit',
            opacity: undoable ? 1 : 0.75,
          }}
        />
      </Button>

      <Button title='redo' disabled={!redoable} onClick={() => redo()}>
        <IconFont
          iconName='icon-redo'
          style={{
            cursor: 'inherit',
            opacity: redoable ? 1 : 0.75,
          }}
        />
      </Button>
      <Stack.Item />
    </Stack>
  );
});
