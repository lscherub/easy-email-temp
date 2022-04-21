import { IEmailTemplate } from '@/typings';
import { Form, useForm, useFormState, useField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { BlocksProvider } from '..//BlocksProvider';
import { PropsProvider, PropsProviderProps } from '../PropsProvider';
import { ScrollProvider } from '../ScrollProvider';
import { Config, FormApi, FormState } from 'final-form';
import { useEffect, useState } from 'react';
import setFieldTouched from 'final-form-set-field-touched';
import { FocusBlockLayoutProvider } from '../FocusBlockLayoutProvider';
import { PreviewEmailProvider } from '../PreviewEmailProvider';
import { store } from '@/store';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

export interface EmailEditorProviderProps<T extends IEmailTemplate = any>
  extends PropsProviderProps {
  data: T;
  children: (
    props: FormState<T>,
    helper: FormApi<IEmailTemplate, Partial<IEmailTemplate>>
  ) => React.ReactNode;
  onSubmit?: Config<IEmailTemplate, Partial<IEmailTemplate>>['onSubmit'];
  validationSchema?: Config<
    IEmailTemplate,
    Partial<IEmailTemplate>
  >['validate'];
}

export const EmailEditorProvider = observer(<T extends any>(
  props: EmailEditorProviderProps & T
) => {
  const { data, children, onSubmit = () => { }, validationSchema } = props;


  useEffect(() => {
    const initialValues = {
      subject: data.subject,
      subTitle: data.subTitle,
      content: data.content,
    };
    store.block.setData(initialValues);
  }, []);


  if (!store.block.initialized) return null;

  return (
    <Form<IEmailTemplate>
      initialValues={toJS(store.block.data)}
      onSubmit={onSubmit}
      enableReinitialize
      validate={validationSchema}
      mutators={{ ...arrayMutators, setFieldTouched: setFieldTouched as any }}
      subscription={{ submitting: true, pristine: true }}
    >
      {() => (
        <>
          <BlocksProvider>
            <PropsProvider {...props}>
              <PreviewEmailProvider>


                <ScrollProvider>
                  <FocusBlockLayoutProvider>
                    <FormWrapper children={children} />
                  </FocusBlockLayoutProvider>
                </ScrollProvider>


              </PreviewEmailProvider>

            </PropsProvider>
          </BlocksProvider>
          <RegisterFields />
        </>
      )}
    </Form>
  );
});

function FormWrapper({
  children,
}: {
  children: EmailEditorProviderProps['children'];
}) {
  const data = useFormState<IEmailTemplate>();
  const helper = useForm<IEmailTemplate>();
  return <>{children(data, helper)}</>;
}

// final-form bug https://github.com/final-form/final-form/issues/169

const RegisterFields = React.memo(() => {
  const { touched } = useFormState<IEmailTemplate>();
  const [touchedMap, setTouchedMap] = useState<{ [key: string]: boolean; }>({});

  useEffect(() => {
    if (touched) {
      Object.keys(touched)
        .filter((key) => touched[key])
        .forEach((key) => {
          setTouchedMap((obj) => {
            obj[key] = true;
            return { ...obj };
          });
        });
    }
  }, [touched]);

  return (
    <>
      {Object.keys(touchedMap).map((key) => {
        return <RegisterField key={key} name={key} />;
      })}
    </>
  );
});

function RegisterField({ name }: { name: string; }) {
  useField(name);
  return <></>;
}
