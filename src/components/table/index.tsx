import { Table, Pagination, Tooltip } from 'antd';
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

interface CustomTableRef {
  refresh: () => void;
}

interface Props {
  columns: CustomColumnsType[];
  autoY?: boolean;
  filterItems?: FilterItem[];
  api: (p: any) => Promise<any>;
  rowKey?: string;
  mapToUrl?: boolean;
  limit?: number;
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
    },
    ref,
  ) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultColumnWidth = 100;

    const pageInfo = React.useRef<Record<string, number>>({
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit')
        ? Number(searchParams.get('limit'))
        : limit,
    });
    const [total, setTotal] = React.useState<number>(0);
    const [innerColumns, setInnerColumns] = React.useState<CustomColumnsType[]>(
      [],
    );
    const innerColumnsRef = React.useRef<
      Record<string | number, CustomColumnsType>
    >({});
    const filterParams = React.useRef<Record<string, unknown>>({});
    const [data, setData] = React.useState<Array<any>>([]);
    const tableContainerRef = React.useRef<HTMLDivElement | null>(null);
    const tableHeaderRef = React.useRef<HTMLDivElement | null>(null);
    const tableFooterRef = React.useRef<HTMLDivElement | null>(null);
    const filterComponent = React.useRef<FilterComponent | null>(null);

    const [scrollInfo, setScrollInfo] = React.useState<any>({
      y: 'auto',
      x: '100%',
    });
    const doResize = () => {
      const headerH = tableHeaderRef.current?.clientHeight || 0;
      const footerH = tableFooterRef.current?.clientHeight || 0;
      const containerH = tableContainerRef.current?.clientHeight || 0;
      const toH = containerH - headerH - footerH - 70;
      setScrollInfo(state => ({
        ...state,
        y: toH,
      }));
      const tableContainer = tableContainerRef.current?.querySelectorAll(
        '.ant-table-body',
      )[0] as HTMLDivElement;
      if (tableContainer) tableContainer.style.height = `${toH}px`;
    };

    useImperativeHandle(ref, (): CustomTableRef => {
      return {
        refresh: doGetData,
      };
    });

    // 初始化样式变更
    React.useEffect(() => {
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
      let x: number = 0;
      innerColumnsRef.current = {};
      columns.forEach(col => {
        innerColumnsRef.current[col.dataIndex as string | number] = { ...col };
        if (!col.width) {
          col.minWidth = 100;
        }
        x += col.width ? parseInt(`${col.width}`) : defaultColumnWidth;
        // 用户没有自定义render的时候  内部默认
        if (!col.render) {
          col.render = (text, record, index) => {
            let rVal = text;
            if (col.dataIndex === 'index') {
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
      setScrollInfo(state => ({ ...state, x }));
      setInnerColumns(icolumns);
    }, [columns]);

    const doGetData = async () => {
      const requestParams = {
        ...filterParams.current,
        ...pageInfo.current,
      };

      if (mapToUrl) {
        setSearchParams(requestParams as any);
      }
      const res = await api(requestParams);
      setData(res.list);
      setTotal(res.total);
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

    const sizeChange = (cur, val) => {
      console.log(val);
      pageInfo.current.limit = val;
      pageInfo.current.page = 1;
      doGetData();
    };

    return (
      <div className="table-component" ref={tableContainerRef}>
        {filterItems.length > 0 && (
          <div className="table-component-header" ref={tableHeaderRef}>
            <Filter
              items={filterItems}
              onFilter={onFilter}
              ref={filterComponent}
            ></Filter>
          </div>
        )}
        <div className="table-component-section">
          <Table
            sticky
            pagination={false}
            columns={innerColumns}
            dataSource={data}
            rowKey={rowKey}
            scroll={scrollInfo}
          ></Table>
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
