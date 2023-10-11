import { Table, Pagination, Tooltip } from 'antd';
import type { ColumnType } from 'antd/es/table';
import React from 'react';
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
}

interface Props {
  columns: CustomColumnsType[];
  autoY?: boolean;
  filterItems?: FilterItem[];
  api: (p: any) => Promise<any>;
  rowKey?: string;
  mapToUrl?: boolean;
}

const CustomTable: React.FC<Props> = ({
  columns = [],
  filterItems = [],
  autoY = false,
  api = () => {},
  rowKey = 'id',
  mapToUrl = true,
  ...props
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultColumnWidth = 100;
  const pageInfo = React.useRef({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = React.useState(0);
  const [innerColumns, setInnerColumns] = React.useState<CustomColumnsType[]>(
    [],
  );
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

  // 初始化样式变更
  React.useEffect(() => {
    if (!autoY) {
      window.addEventListener('resize', doResize);
      doResize();
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
    columns.forEach(col => {
      if (!col.width) {
        col.minWidth = 100;
      }
      x += col.width ? parseInt(`${col.width}`) : defaultColumnWidth;
      if (!col.render) {
        if (col.overEllipise) {
          col.render = val => (
            <Tooltip title={val}>
              <span>{val}</span>
            </Tooltip>
          );
        } else {
          col.render = val => <div>{val}</div>;
        }
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
    const { params } = filterRes;
    filterParams.current = params;
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
        <Pagination total={total}></Pagination>
      </div>
    </div>
  );
};

export default CustomTable;
