import { DoubleRightOutlined } from '@ant-design/icons';
import { Select, Button, DatePicker } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, useImperativeHandle } from 'react';
import { useSearchParams } from 'react-router-dom';
import { componentMap } from '@/utils/antd';
import { formatEmptyRecord, throttle } from '@/utils/util';
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
  component?: keyof FullInputComponentMap;
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
  ctrls?: React.ReactNode | React.ReactElement;
  itemMinWidth?: number;
}

// eslint-disable-next-line react/display-name
const Filter = React.forwardRef(
  (
    {
      items = [],
      onFilter = () => {},
      paramFromUrl = true,
      itemMinWidth = 300,
      ...props
    }: Props,
    ref,
  ) => {
    const [searchParams] = useSearchParams();
    const [innerItems, setInnerItems] = React.useState<InnerFilterItem[]>([]);
    // 对象存储方便查找
    const innerItemsRecord = React.useRef<Record<string, InnerFilterItem>>({});
    const [defaultParams, setDefaultParams] = React.useState<
      Record<string, any>
    >({});
    const filterRenderType = ['select', 'date', 'daterange'];
    const filterRef = React.useRef<HTMLDivElement>(null);
    const [itemStyle, setItemStyle] = React.useState({});
    const colNum = React.useRef<number>(4);
    const [params, setParams] = React.useState<Record<string, any>>({});
    const [isShowMore, setIsShowMore] = React.useState<boolean>(false);

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
    React.useEffect(() => {
      let timer;
      const myObserver: ResizeObserver = new ResizeObserver(() => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        doResize();
      });
      myObserver.observe(filterRef.current as Element);
      doResize();
      return () => {
        myObserver.disconnect();
      };
    }, []);

    const doResize = () => {
      if (!filterRef.current) {
        setTimeout(() => doResize, 1000);
        return;
      }

      const w = filterRef.current.clientWidth;
      let col = Math.floor(w / itemMinWidth);
      if (w < itemMinWidth) {
        col = 1;
      }
      console.log(123123, col, w, itemMinWidth);
      colNum.current = col;
      setItemStyle(sty => ({
        ...sty,
        flex: `0 0 ${(w - (col - 1) * 20) / col}px`,
      }));
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
        if (item.component && item.component === 'select' && item.option) {
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

    const resetClick = throttle(() => {
      setParams({
        ...defaultParams,
      });
      formatFilter(defaultParams);
    });
    const filterClick = throttle(() => {
      formatFilter(params);
    });

    return (
      <div className="filter-component">
        <div className="filter-form" ref={filterRef}>
          {innerItems.map((item: InnerFilterItem, idx: number) => {
            let Item, Comp;
            if (item.render) {
              Item = item.render;
            }
            if (item.component) {
              Comp = componentMap[item.component];
            }
            if (2 * colNum.current <= idx && !isShowMore) return null;
            return (
              <div
                key={item.key}
                className="filter-form-item"
                style={{
                  ...itemStyle,
                  marginRight: (idx + 1) % colNum.current === 0 ? '0' : '20px',
                }}
              >
                <div className="filter-form-item-label">{item.label}:</div>
                <div className="filter-form-item-value">
                  {!!item.component &&
                    !filterRenderType.includes(item.component) &&
                    React.cloneElement(Comp, {
                      value: params[item.key],
                      onChange: evt => changeParams(evt, item.key),
                    })}
                  {!!item.component &&
                    filterRenderType.includes(item.component) &&
                    item.component === 'select' && (
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
                  {!!item.component &&
                    filterRenderType.includes(item.component) &&
                    item.component &&
                    ['date'].includes(item.component) && (
                      <DatePicker
                        style={{ width: '100%' }}
                        {...(item.props || {})}
                        value={params[item.key]}
                        onChange={evt =>
                          changeParams({ target: { value: evt } }, item.key)
                        }
                      ></DatePicker>
                    )}
                  {!!item.component &&
                    filterRenderType.includes(item.component) &&
                    item.component &&
                    ['daterange'].includes(item.component) && (
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
          {innerItems?.length && (
            <>
              <Button
                type={'primary'}
                className="filter-btn"
                onClick={filterClick}
              >
                筛选
              </Button>
              <Button onClick={resetClick} className="filter-btn">
                重置
              </Button>
            </>
          )}
          {props.ctrls}
        </div>
        {2 * colNum.current < innerItems.length && (
          <div
            className="filter-more-box"
            onClick={() => setIsShowMore(isShow => !isShow)}
          >
            <DoubleRightOutlined
              className={classNames('filter-more', {
                'filter-more-close': isShowMore,
              })}
            />
          </div>
        )}
      </div>
    );
  },
);

export default Filter;
