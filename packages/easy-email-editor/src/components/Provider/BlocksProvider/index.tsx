import { EventManager } from '@/utils';
import { store } from '@/store';
import { EventType } from '@/utils/EventManager';
import { isFunction } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { autorun, toJS } from 'mobx';
import { IEmailTemplate } from '@/typings';
import { observer } from 'mobx-react-lite';

export enum ActiveTabKeys {
  EDIT = 'EDIT',
  MOBILE = 'MOBILE',
  PC = 'PC',
}

export const BlocksContext = React.createContext<{
  initialized: boolean;
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>;

  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: ActiveTabKeys;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTabKeys>>;
  values: IEmailTemplate;
}>({} as any);

export const BlocksProvider: React.FC<{}> = observer((props) => {

  const [initialized, setInitialized] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState(ActiveTabKeys.EDIT);

  const [values, setValues] = useState(store.block.data);

  useEffect(() => {
    const disposer = autorun(() => {
      setValues(toJS(store.block.data));
    });

    return () => {
      disposer();
    };
  }, []);

  const onChangeTab: React.Dispatch<React.SetStateAction<ActiveTabKeys>> = useCallback((handler) => {
    if (isFunction(handler)) {
      setActiveTab((currentTab) => {
        const nextTab = handler(currentTab);
        const next = EventManager.exec(EventType.ACTIVE_TAB_CHANGE, { currentTab, nextTab });
        if (next) return nextTab;
        return currentTab;
      });
    }
    setActiveTab((currentTab) => {
      let nextTab = handler as ActiveTabKeys;
      const next = EventManager.exec(EventType.ACTIVE_TAB_CHANGE, { currentTab, nextTab });
      if (next) return nextTab;
      return currentTab;
    });
  }, []);

  return (
    <BlocksContext.Provider
      value={{
        initialized,
        setInitialized,
        collapsed,
        setCollapsed,
        activeTab,
        setActiveTab: onChangeTab,
        values
      }}
    >
      {props.children}
    </BlocksContext.Provider>
  );
});
