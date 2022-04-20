import { IBlock } from '@core/typings';
import { getAdapterAttributesString, getChildIdx } from '@core/utils';
import React from 'react';
import { BlockRenderer } from './BlockRenderer';

export function BasicBlock(props: { params: Parameters<IBlock['render']>[0]; tag: string; children?: React.ReactNode; }) {
  const { params, params: { data, idx, children: children2 }, tag, children } = props;

  return (
    <>
      {`<${tag} ${getAdapterAttributesString(params)}>`}
      {children || children2 || data.children.map((child, index) => (
        <BlockRenderer key={index} {...params} idx={idx ? getChildIdx(idx, index) : null} data={child} />
      ))}
      {`</${tag}>`}
    </>
  );
}
