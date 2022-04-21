import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useFocusIdx, Stack, useBlock, TextStyle } from 'easy-email-editor';
import { Form, useForm, useFormState } from 'react-final-form';
import { Grid } from '@arco-design/web-react';
import { get } from 'lodash';
import { createBlockDataByType } from 'easy-email-core';

export interface PaddingProps {
  title?: string;
  attributeName?: 'padding' | 'inner-padding' | 'text-padding';
  name?: string;
}

export function Padding(props: PaddingProps = {}) {
  const { title = 'Padding', attributeName = 'padding', name } = props;
  const { focusBlock, } = useBlock();
  const { change, } = useForm();
  const { values } = useFormState();
  const { focusIdx } = useFocusIdx();
  const divRef = useRef(document.createElement('div'));
  const divModifyRef = useRef(document.createElement('div'));

  const type = focusBlock && focusBlock.type;

  const defaultConfig = useMemo(
    () => (type ? createBlockDataByType(type) : undefined),
    [type]
  );

  const paddingValue: string | undefined = useMemo(() => {
    if (name) {
      return get(values, name);
    }
    return focusBlock?.attributes[attributeName];
  }, [attributeName, focusBlock?.attributes, name, values]);

  const defaultPaddingValue: string | undefined = useMemo(() => {
    return defaultConfig?.attributes[attributeName];
  }, [attributeName, defaultConfig?.attributes]);

  const paddingFormValues = useMemo(() => {
    if (paddingValue) {
      divRef.current.style.padding = paddingValue;
    }
    const top = divRef.current.style.paddingTop;
    const right = divRef.current.style.paddingRight;
    const bottom = divRef.current.style.paddingBottom;
    const left = divRef.current.style.paddingLeft;

    return {
      top,
      left,
      bottom,
      right,
    };
  }, [paddingValue]);

  const onChancePadding = useCallback(
    (val: string) => {
      divModifyRef.current.style.padding = val;
      if (
        divModifyRef.current.style.paddingTop === divRef.current.style.paddingTop
        && divModifyRef.current.style.paddingRight === divRef.current.style.paddingRight
        && divModifyRef.current.style.paddingBottom === divRef.current.style.paddingBottom
        && divModifyRef.current.style.paddingLeft === divRef.current.style.paddingLeft) {
        return;
      }
      if (name) {
        change(name, val);
      } else {
        change(focusIdx + `.attributes[${attributeName}]`, val);
      }

    },
    [name, change, focusIdx, attributeName]
  );

  return useMemo(() => {
    return (
      <Form<{ top: string; right: string; left: string; bottom: string; }>
        initialValues={paddingFormValues}
        subscription={{ submitting: true, pristine: true }}
        enableReinitialize
        onSubmit={() => { }}
      >
        {() => {
          return (
            <>
              <Stack vertical spacing='extraTight'>
                <TextStyle variation='strong'>{title}</TextStyle>

                <Grid.Row>
                  <Grid.Col span={11}>
                    <InputWithUnitField label='Top' name='top' />
                  </Grid.Col>
                  <Grid.Col offset={1} span={11}>
                    <InputWithUnitField label='Left' name='left' />
                  </Grid.Col>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Col span={11}>
                    <InputWithUnitField label='Bottom' name='bottom' />
                  </Grid.Col>
                  <Grid.Col offset={1} span={11}>
                    <InputWithUnitField label='Right' name='right' />
                  </Grid.Col>
                </Grid.Row>
              </Stack>
              <PaddingChangeWrapper onChange={onChancePadding} />
            </>
          );
        }}
      </Form>
    );
  }, [onChancePadding, paddingFormValues, title]);
}

const PaddingChangeWrapper: React.FC<{ onChange: (val: string) => void; }> = (
  props
) => {
  const {
    values: { top, right, bottom, left },
  } = useFormState();
  const { onChange } = props;

  useEffect(() => {
    onChange([top, right, bottom, left].join(' '));
  }, [top, right, bottom, left, onChange]);

  return <></>;
};