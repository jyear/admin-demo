import { SettingFilled } from '@ant-design/icons';
import { Table, Pagination, Tooltip, Popover, Button, Checkbox } from 'antd';
import type { ColumnType } from 'antd/es/table';
import React, { useImperativeHandle } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filter, {
  FilterItem as TableFilterItem,
  FilterComponent,
} from '@/components/filter';
import './index.less';

export interface FilterItem extends TableFilterItem {}

export interface CustomColumnsType extends ColumnType<any> {
  minWidth?: number;
  overEllipise?: boolean;
  total?: boolean;
  formatter?: ({
    text,
    index,
    record,
  }: {
    text?: string | number;
    index?: number;
    record?: Record<string | number, unknown>;
  }) => string | number;
}

export interface CustomTableRef {
  refresh: () => void;
}

export interface TableProps extends Props {}
interface Props {
  columns: CustomColumnsType[];
  autoY?: boolean;
  filterItems?: FilterItem[];
  api: (p: any) => Promise<any>;
  rowKey?: string;
  mapToUrl?: boolean;
  limit?: number;
  defaultUnShowColumns?: string[] | 'none';
  showFilterColumns?: boolean;
  tableKey?: string;
  ctrls?: React.ReactNode | React.ReactElement;
  filterItemMinWidth?: number;
}

const CustomTable = React.forwardRef<CustomTableRef, Props>(
  (
    {
      columns = [],
      filterItems = [],
      autoY = false,
      api = () => {},
      rowKey = 'id',
      mapToUrl = true,
      limit = 20,
      defaultUnShowColumns = 'none',
      showFilterColumns = true,
      tableKey = '',
      filterItemMinWidth = 300,
      ctrls = null,
      ...props
    },
    ref,
  ) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultColumnWidth = 100;
    const pageInfo = React.useRef<Record<string, number>>({
      page:
        searchParams.get('page') && mapToUrl
          ? Number(searchParams.get('page'))
          : 1,
      limit:
        searchParams.get('limit') && mapToUrl
          ? Number(searchParams.get('limit'))
          : limit,
    });
    const [total, setTotal] = React.useState<number>(0);
    const [innerColumns, setInnerColumns] = React.useState<CustomColumnsType[]>(
      [],
    );
    const [renderColumns, setRenderColumns] = React.useState<
      CustomColumnsType[]
    >([]);

    const innerColumnsRef = React.useRef<
      Record<string | number, CustomColumnsType>
    >({});
    const filterParams = React.useRef<Record<string, unknown>>({});
    const [data, setData] = React.useState<Array<any>>([]);
    const tableContainerRef = React.useRef<HTMLDivElement | null>(null);
    const tableHeaderRef = React.useRef<HTMLDivElement | null>(null);
    const tableFooterRef = React.useRef<HTMLDivElement | null>(null);
    const filterComponent = React.useRef<FilterComponent | null>(null);
    const innerTableKey = React.useRef<string>(tableKey);
    const [loading, setLoading] = React.useState(false);
    // 展示列
    const [innerUnShow, setInnerUnShow] = React.useState<(string | number)[]>(
      [],
    );

    const [scrollInfo, setScrollInfo] = React.useState<any>({
      y: 'auto',
      x: '100%',
    });
    const doResize = () => {
      const headerH = tableHeaderRef.current?.clientHeight || 0;
      const footerH = tableFooterRef.current?.clientHeight || 0;
      const containerH = tableContainerRef.current?.clientHeight || 0;
      const tableHeader = tableContainerRef.current?.querySelectorAll(
        '.ant-table-header.ant-table-sticky-holder',
      )[0];
      const toH =
        containerH -
        headerH -
        footerH -
        (tableHeader?.clientHeight || 0) -
        (headerH ? 10 : 0);

      setScrollInfo(state => ({
        ...state,
        y: toH,
      }));
      const tableContainer = tableContainerRef.current?.querySelectorAll(
        '.ant-table-body',
      )[0] as HTMLDivElement;
      if (tableContainer) tableContainer.style.height = `${toH}px`;
    };

    // 最终需要展示的列
    React.useEffect(() => {
      computRenderColumns(innerColumns);
      // doResize();
    }, [innerColumns, innerUnShow]);

    // ref 操作
    useImperativeHandle(ref, (): CustomTableRef => {
      return {
        refresh: doGetData,
      };
    });

    // 初始化样式变更
    React.useEffect(() => {
      if (!tableKey) {
        innerTableKey.current = `table_${window.location.pathname}`;
      } else {
        innerTableKey.current = tableKey;
      }
      // 不展示列处理
      let toUnShow: (string | number)[] = [];
      if (defaultUnShowColumns !== 'none' && showFilterColumns) {
        toUnShow = [...defaultUnShowColumns];
      }
      // debugger;
      const localUnShow = localStorage.getItem(
        `${innerTableKey.current}_unShow`,
      );
      console.log('获取缓存', innerTableKey.current, localUnShow);
      if (localUnShow && localUnShow.length > 0) {
        toUnShow = localUnShow.split(',');
      }
      setInnerUnShow(toUnShow);
      if (!autoY) {
        window.addEventListener('resize', doResize);
        setTimeout(() => {
          doResize();
        }, 200);
      }
      if (filterItems.length <= 0) {
        doGetData();
      }
      return () => {
        if (!autoY) window.removeEventListener('resize', doResize);
      };
    }, []);

    // 初始化columns
    React.useEffect(() => {
      const icolumns: CustomColumnsType[] = [];
      innerColumnsRef.current = {};
      columns.forEach(col => {
        innerColumnsRef.current[col.dataIndex as string | number] = {
          ...col,
        };
        if (!col.width) {
          col.minWidth = 100;
        }
        // 用户没有自定义render的时候  内部默认
        if (!col.render) {
          col.render = (text, record, index) => {
            let rVal = text;
            if (col.dataIndex === 'index') {
              if (col.total)
                return pageInfo.current.page * pageInfo.current.limit + 1;
              return index + 1;
            }
            if (col.formatter) {
              rVal = col.formatter({ text: text, index, record });
            }
            if (col.overEllipise)
              return (
                <Tooltip title={rVal}>
                  <div className="table-singal-line">{rVal}</div>
                </Tooltip>
              );
            return <div>{rVal}</div>;
          };
        }
        if (col.render) {
          const render = col.render;
          col.render = (text, record, index) => {
            const handler = {
              refresh() {
                doGetData();
              },
            };
            return render.apply(null, [text, record, index, handler]);
          };
        }

        icolumns.push(col);
      });
      setInnerColumns(icolumns);
    }, [columns]);

    const computRenderColumns = data => {
      const showColumns: CustomColumnsType[] = [];
      let x: number = 0;
      data.forEach((col: CustomColumnsType) => {
        if (!innerUnShow.includes(col.key as string)) {
          showColumns.push(col);
          x += col.width ? parseInt(`${col.width}`) : defaultColumnWidth;
        }
      });
      setRenderColumns(showColumns);
      setScrollInfo(state => ({ ...state, x }));
    };

    const doGetData = async () => {
      const requestParams = {
        ...filterParams.current,
        ...pageInfo.current,
      };

      if (mapToUrl) {
        setSearchParams(requestParams as any);
      }
      try {
        setLoading(true);
        const res = await api(requestParams);
        setData(res.list);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    };

    const onFilter = filterRes => {
      const { params, isFirst } = filterRes;
      filterParams.current = params;
      if (!isFirst) {
        pageInfo.current.page = 1;
      }
      doGetData();
    };

    const pageChange = val => {
      pageInfo.current.page = val;
      doGetData();
    };

    const sizeChange = (_, val) => {
      pageInfo.current.limit = val;
      pageInfo.current.page = 1;
      doGetData();
    };

    const showColumnChange = (key: string) => {
      let arr: (string | number)[] = [];
      if (!innerUnShow.includes(key)) {
        arr = [...innerUnShow, key];
      } else {
        const idx = innerUnShow.indexOf(key);
        arr = [...innerUnShow];
        arr.splice(idx, 1);
      }
      setInnerUnShow([...arr]);
      if (innerTableKey.current) {
        localStorage.setItem(`${innerTableKey.current}_unShow`, arr.join(','));
      }
    };

    return (
      <div className="table-component" ref={tableContainerRef}>
        {(filterItems?.length || ctrls) && (
          <div className="table-component-header" ref={tableHeaderRef}>
            <Filter
              items={filterItems || []}
              onFilter={onFilter}
              ref={filterComponent}
              paramFromUrl={mapToUrl}
              itemMinWidth={filterItemMinWidth}
              ctrls={ctrls}
            ></Filter>
          </div>
        )}
        <div className="table-component-section">
          <Table
            sticky
            loading={loading}
            pagination={false}
            columns={renderColumns}
            dataSource={data}
            rowKey={rowKey}
            scroll={scrollInfo}
            {...props}
          ></Table>
          {showFilterColumns && (
            <div className="table-component-section-filter">
              <Popover
                placement="bottomLeft"
                content={
                  <div className="table-filter-box">
                    {innerColumns.map((col: CustomColumnsType, idx: number) => {
                      return (
                        <div
                          key={`${col.key}_${idx}`}
                          className="table-filter-item"
                        >
                          <Checkbox
                            checked={!innerUnShow.includes(col.key as string)}
                            onChange={() => showColumnChange(col.key as string)}
                          >
                            <div className="table-filter-item-name">
                              {col.title as string}
                            </div>
                          </Checkbox>
                        </div>
                      );
                    })}
                  </div>
                }
                trigger="click"
              >
                <SettingFilled></SettingFilled>
              </Popover>
            </div>
          )}
        </div>
        <div className="table-component-footer" ref={tableFooterRef}>
          <Pagination
            onChange={pageChange}
            onShowSizeChange={sizeChange}
            total={total}
            current={pageInfo.current.page}
            pageSize={pageInfo.current.limit}
          ></Pagination>
        </div>
      </div>
    );
  },
);

CustomTable.displayName = 'CustomTable';
export default CustomTable;
