import { Form, Input, Select, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { ReactElement, ReactNode, useImperativeHandle } from 'react';
import { useSearchParams } from 'react-router-dom';
import './index.less';

const { RangePicker } = DatePicker;

export interface FilterItem {
  key: string;
  label: string;
  component?: 'input' | 'select' | 'date' | 'daterange';
  defaultValue?: unknown;
  mapValueLabel?: Record<string, string>;
  option?: Record<string, string | number>[];
  render?: ReactElement | ReactNode | ((p: any) => any);
  decode?: (val: string) => any;
  paramKey?: string[];
  props?: Record<string | number, any>;
  dateFormat?: string;
}

interface InnerFilterItem extends FilterItem {
  formatedOption?: FormatedOption[];
}
interface FormatedOption {
  value: string | number;
  label: string | number;
  [key: string | number]: any;
}

export interface FilterComponent {
  setParams: (p: Record<string, any>) => void;
}

interface Props {
  items: FilterItem[];
  onFilter?: (p: Record<string, unknown>) => void;
}

// eslint-disable-next-line react/display-name
const Filter = React.forwardRef(
  ({ items = [], onFilter = () => {}, ...props }: Props, ref) => {
    const [searchParams] = useSearchParams();
    const [innerItems, setInnerItems] = React.useState<InnerFilterItem[]>([]);
    // 对象存储方便查找
    const innerItemsRecord = React.useRef<Record<string, InnerFilterItem>>({});
    const [defaultParams, setDefaultParams] = React.useState<
      Record<string, any>
    >({});

    const [params, setParams] = React.useState<Record<string, any>>({});

    useImperativeHandle(ref, (): FilterComponent => {
      return {
        setParams: outParams => {
          setDefaultParams(params => ({
            ...params,
            ...outParams,
          }));
        },
      };
    });

    const initParams = () => {
      const res = {};
      searchParams.forEach((param, key) => {
        res[key] = param;
      });
      return res;
    };
    // 初始化筛选项
    React.useEffect(() => {
      if (items.length <= 0) {
        return;
      }
      const defaultP = {};
      const iItemsRecord = {};
      const urlParams = initParams();
      const iItems = items.map((item: FilterItem): InnerFilterItem => {
        const innerItem: InnerFilterItem = item;
        defaultP[item.key] = item.defaultValue || '';
        if (item.component === 'select' && item.option) {
          const opts: InnerFilterItem['formatedOption'] = [];
          item.option.forEach(opt => {
            const valueKey = item.mapValueLabel?.value || 'value';
            const labelKey = item.mapValueLabel?.label || 'label';
            const formatOpt: FormatedOption = {
              ...opt,
              value: opt[valueKey],
              label: opt[labelKey],
            };
            opts.push(formatOpt);
          });
          innerItem.formatedOption = opts;
        }
        if (innerItem.decode && urlParams[innerItem.key]) {
          urlParams[innerItem.key] = innerItem.decode(urlParams[innerItem.key]);
        }
        if (innerItem.paramKey?.length) {
          // urlParams[innerItem.key] = innerItem.encode(urlParams[innerItem.key]);
        }

        iItemsRecord[innerItem.key] = { ...innerItem };
        return {
          ...innerItem,
        };
      });
      setInnerItems(iItems);
      innerItemsRecord.current = iItemsRecord;
      setDefaultParams(defaultP);
      const toParams = {
        ...defaultP,
        ...urlParams,
      };
      setParams(toParams);
      // 出发初始化事件通知外部
      formatFilter(toParams);
    }, [items]);

    const formatFilter = needFormatParams => {
      const toParams = {};
      Object.keys(needFormatParams).forEach(key => {
        if (!innerItemsRecord.current[key]) {
          toParams[key] = needFormatParams[key];
        } else {
          if (
            ['date'].includes(innerItemsRecord.current[key].component as string)
          ) {
            console.log(222, innerItemsRecord.current[key]);
            toParams[key] = dayjs(toParams[key]).format(
              innerItemsRecord.current[key]?.props?.format || 'YYYY-MM-DD',
            );
          } else if (
            ['daterange'].includes(
              innerItemsRecord.current[key].component as string,
            )
          ) {
            console.log(needFormatParams[key]);
          } else {
            toParams[key] = needFormatParams[key];
          }
        }
      });
      onFilter({
        params: toParams,
      });
    };

    const changeParams = (evt, key) => {
      setParams(param => {
        return {
          ...param,
          [key]: evt.target.value,
        };
      });
    };

    const resetClick = () => {
      setParams({
        ...defaultParams,
      });
      formatFilter(defaultParams);
    };
    const filterClick = () => {
      formatFilter(params);
    };

    return (
      <div className="filter-component">
        <div className="filter-form">
          {innerItems.map((item: InnerFilterItem) => {
            return (
              <div key={item.key} className="filter-form-item">
                <div className="filter-form-item-label">{item.label}:</div>
                <div className="filter-form-item-value">
                  {item.component === 'input' && (
                    <Input
                      value={params[item.key]}
                      onChange={evt => changeParams(evt, item.key)}
                      {...(item.props || {})}
                    ></Input>
                  )}
                  {item.component === 'select' && (
                    <Select
                      style={{ width: '100%' }}
                      value={params[item.key]}
                      {...(item.props || {})}
                      onChange={evt =>
                        changeParams({ target: { value: evt } }, item.key)
                      }
                      options={item.formatedOption as any}
                    ></Select>
                  )}
                  {item.component && ['date'].includes(item.component) && (
                    <DatePicker
                      style={{ width: '100%' }}
                      {...(item.props || {})}
                      value={params[item.key]}
                      onChange={evt =>
                        changeParams({ target: { value: evt } }, item.key)
                      }
                    ></DatePicker>
                  )}
                  {item.component && ['daterange'].includes(item.component) && (
                    <RangePicker
                      style={{ width: '100%' }}
                      {...(item.props || {})}
                      onChange={evt =>
                        changeParams({ target: { value: evt } }, item.key)
                      }
                      value={params[item.key]}
                    ></RangePicker>
                  )}
                </div>
              </div>
            );
          })}
          <Button type={'primary'} className="filter-btn" onClick={filterClick}>
            筛选
          </Button>
          <Button onClick={resetClick}>重置</Button>
        </div>
      </div>
    );
  },
);

export default Filter;
