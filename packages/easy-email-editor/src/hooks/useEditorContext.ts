import { useContext } from 'react';
import { BlocksContext } from '@/components/Provider/BlocksProvider';

export function useEditorContext() {
  const { initialized, setInitialized, values } = useContext(BlocksContext);

  return {
    initialized,
    setInitialized,
    pageData: values.content,
    values,
  };
}
