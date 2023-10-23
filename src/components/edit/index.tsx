import { Form, Modal } from 'antd';
import { Rule } from 'antd/es/form';
import React from 'react';
import Button from '@/components/button';
import { fullComponentMap } from '@/utils/antd';
import './index.less';

export interface RenderParams {
  value: any;
  key: string;
  formData?: Record<string, unknown>;
  props?: Record<string, unknown>;
  onChange?: (p: any) => void;
  onValuesChange?: (p: any) => void;
}

export interface EditItem {
  key: string;
  label: string;
  component?: keyof FullInputComponentMap;
  render?: (p: RenderParams) => React.ReactNode;
  rules?: Rule[];
  props?: Record<string, unknown>;
  defaultValue?: unknown;
}

interface Props {
  title: string;
  okText?: string;
  okType?: 'primary' | 'link' | 'text' | 'default' | 'dashed' | undefined;
  centered?: boolean;
  cancelText?: string;
  style?: React.CSSProperties;
  open: boolean;
  wrapClassName?: string;
  width?: string | number;
  footer?: (params: any) => React.ReactNode | React.ReactNode;
  onCancel?: () => void;
  onOk?: (data: Record<string | number, unknown>) => Promise<unknown>;
  forms?: EditItem[];
  autoValid?: boolean;
  data?: Record<string, unknown>;
}

const Edit = React.forwardRef<any, Props>(
  (
    {
      title = '',
      open = false,
      wrapClassName = '',
      footer = null,
      centered = true,
      forms = [],
      data = {},
      width = 500,
      cancelText = '取消',
      okText = '确定',
      okType = 'primary',
      onOk = () => {},
      onCancel = () => {},
      autoValid = true,
      ...props
    },
    ref,
  ) => {
    const [form] = Form.useForm();
    const [innerData, setInnerData] = React.useState({});
    const [innerOpen, setInnerOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
      const resValue = {};
      if (forms.length) {
        forms.forEach(item => {
          resValue[item.key] = item.defaultValue || '';
        });
      }
      setInnerData(resValue);
      form.setFieldsValue(resValue);
    }, [innerOpen]);
    React.useEffect(() => {
      if (data && innerOpen) {
        setInnerData(idate => ({ ...idate, ...data }));
        form.setFieldsValue({ ...(data as any) });
      }
    }, [data, innerOpen]);

    React.useEffect(() => {
      setInnerOpen(open);
    }, [open]);

    const confirmClick = async () => {
      if (form && autoValid) {
        await form.validateFields();
      }
      try {
        if (onOk && typeof onOk === 'function') {
          setIsLoading(true);
          await onOk(innerData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const cancelClick = async () => {
      if (onCancel && typeof onCancel === 'function') {
        await onCancel();
      }
    };

    const defaultFooter = () => {
      return (
        <div>
          <Button onClick={cancelClick}>{cancelText}</Button>
          <Button loading={isLoading} type={okType} onClick={confirmClick}>
            {okText}
          </Button>
        </div>
      );
    };
    const dataChange = (val, key: string) => {
      setInnerData(idate => {
        return {
          ...idate,
          [key]: val,
        };
      });
    };

    const formChange = val => {
      setInnerData(iData => {
        return {
          ...iData,
          ...val,
        };
      });
    };

    // if (!innerOpen) return null;

    return (
      <Modal
        open={innerOpen}
        wrapClassName={`edit-modal ${wrapClassName}`}
        centered={centered}
        title={title}
        footer={footer || defaultFooter}
        width={width}
        destroyOnClose={true}
        onCancel={cancelClick}
      >
        <Form preserve={false} form={form} onValuesChange={formChange}>
          {forms.map(item => {
            let Comp, RenderComp;
            if (item.component) {
              Comp = fullComponentMap[item.component];
            }
            if (item.render) {
              RenderComp = item.render;
            }
            return (
              <Form.Item
                key={item.key}
                label={item.label}
                name={item.key}
                rules={item.rules || []}
              >
                {Comp &&
                  React.cloneElement(Comp, {
                    style: { width: '100%' },
                    ...item.props,
                  })}

                {RenderComp && (
                  <RenderComp
                    props={{
                      style: { width: '100%' },
                      ...item.props,
                    }}
                  ></RenderComp>
                )}
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    );
  },
);

Edit.displayName = 'Edit';

export default Edit;
