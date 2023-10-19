import { Input, Select, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { ReactElement, ReactNode, useImperativeHandle } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatEmptyRecord } from '@/utils/util';
import './index.less';

const { RangePicker } = DatePicker;

// filterMap 映射
//   filterMap={
//     a:'b'
//   }
//   表示key为filterParams的key b表示urlParams上的参数key
// filterMap = ['startTime', 'endTime'];
// 表示会把urlParams上的startTime endTime映射到filterParams的对应的数据上为[]呈现

export interface FilterItem {
  key: string;
  label: string;
  component?: 'input' | 'select' | 'date' | 'daterange';
  defaultValue?: unknown;
  mapValueLabel?: Record<string, string>;
  option?: Record<string, string | number>[];
  render?: (p: {
    val: unknown;
    onChange: (val: unknown) => void;
  }) => ReactElement;
  decode?: (val: string) => any;
  encode?: (val: any) => string | number;
  filterMap?: Record<string, any> | string[];
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
  paramFromUrl?: boolean;
  onFilter?: (p: Record<string, unknown>) => void;
}

// eslint-disable-next-line react/display-name
const Filter = React.forwardRef(
  (
    { items = [], onFilter = () => {}, paramFromUrl = true, ...props }: Props,
    ref,
  ) => {
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

    const decodeData = (val, curItem) => {
      if (!val) return val;

      let curDecode = curItem?.decode;
      if (
        curItem &&
        curItem.component &&
        !curDecode &&
        ['date', 'daterange'].includes(curItem.component)
      ) {
        curDecode = toVal => dayjs(toVal);
      }
      return curDecode ? curDecode(val) : val;
    };

    const encodeData = (val, curItem) => {
      if (!val) return val;
      let curEncode = curItem?.encode;

      if (
        curItem &&
        curItem.component &&
        !curEncode &&
        ['date', 'daterange'].includes(curItem.component)
      ) {
        const formatStr = curItem.props?.format || 'YYYY-MM-DD';
        curEncode = toVal => dayjs(toVal).format(formatStr);
      }
      return curEncode ? curEncode(val) : val;
    };
    // 初始化筛选项
    React.useEffect(() => {
      if (items.length <= 0) {
        return;
      }
      const defaultP = {};
      const iItemsRecord = {};
      const urlParams = paramFromUrl ? {} : initParams();
      const iItems = items.map((item: FilterItem): InnerFilterItem => {
        const innerItem: InnerFilterItem = item;
        defaultP[item.key] = item.defaultValue || '';
        // 初始化解析类型为select的options的map映射问题
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
        // 初始化判断为daterange 检查filterMap是否存在
        if (
          item.component === 'daterange' &&
          (!item.filterMap ||
            !Array.isArray(item.filterMap) ||
            item.filterMap.length != 2)
        ) {
          throw new Error('daterange的filterMap必须为长度为2的string[]');
        }

        if (paramFromUrl) {
          //处理需要映射的数据结构
          if (innerItem.filterMap && typeof innerItem.filterMap === 'object') {
            //映射结构为数组时候
            if (Array.isArray(innerItem.filterMap)) {
              urlParams[innerItem.key] = [];
              innerItem.filterMap.forEach((key: string) => {
                if (urlParams[key]) {
                  const toData = decodeData(urlParams[key], innerItem);
                  urlParams[innerItem.key].push(toData);
                  delete urlParams[key];
                }
              });
            }
            // 处理映射为对象结构
            if (!Array.isArray(innerItem.filterMap)) {
              urlParams[innerItem.key] = {};
              Object.keys(innerItem.filterMap).forEach((key: string) => {
                if (innerItem.filterMap && innerItem.filterMap[key]) {
                  urlParams[innerItem.key][key] = decodeData(
                    urlParams[innerItem.filterMap[key]],
                    innerItem,
                  );
                  delete urlParams[innerItem.filterMap[key]];
                } else {
                  throw new Error('filterMap 映射错误');
                }
              });
            }
          } else {
            if (urlParams[innerItem.key]) {
              urlParams[innerItem.key] = decodeData(
                urlParams[innerItem.key],
                innerItem,
              );
            }
          }
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
        ...(Object.keys(initParams()).length > 0 ? {} : defaultP), // 只有第一次不带参数进入的时候才会使用defaultValue
        ...urlParams,
      };
      setParams(toParams);
      // 出发初始化事件通知外部
      formatFilter(toParams);
    }, [items]);

    const formatFilter = needFormatParams => {
      const toParams = {};
      Object.keys(needFormatParams).forEach(key => {
        const current = innerItemsRecord.current[key];
        // 处理映射数据
        if (current?.filterMap && typeof current.filterMap === 'object') {
          if (
            Array.isArray(current.filterMap) &&
            needFormatParams[current.key]?.length
          ) {
            current.filterMap.forEach((key: string, idx: number) => {
              toParams[key] = encodeData(
                needFormatParams[current.key][idx],
                current,
              );
            });
          }
          if (!Array.isArray(current.filterMap)) {
            Object.keys(current.filterMap).forEach((key: string) => {
              if (current.filterMap && current.filterMap[key]) {
                const urlKey = current.filterMap[key];
                toParams[urlKey] = encodeData(
                  needFormatParams[current.key][key],
                  current,
                );
              }
            });
          }
        } else {
          toParams[key] = encodeData(needFormatParams[key], current);
        }
      });

      onFilter({
        params: formatEmptyRecord(toParams),
        isFirst: true,
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
            let Item;
            if (item.render) {
              Item = item.render;
            }
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
                      allowClear
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
                  {!item.component &&
                    React.cloneElement(<Item></Item>, {
                      val: params[item.key],
                      onChange: evt =>
                        changeParams({ target: { value: evt } }, item.key),
                    })}
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
