import { Drawer, DrawerProps, Space } from 'antd';
import React from 'react';
import Button from '@/components/button';
import Table, { TableProps, CustomTableRef } from '@/components/table';
import './index.less';

interface Props extends DrawerProps {
  type?: 'table';
  tableConfig?: TableProps;
}

const DrawBox = React.forwardRef<any, Props>(
  (
    {
      open = false,
      onClose = () => {},
      className = '',
      type = 'table',
      tableConfig = {
        columns: [],
        mapToUrl: false,
        api: () => Promise.resolve(''),
      },
      ...props
    },
    ref,
  ) => {
    const [innerOpen, setInnerOpen] = React.useState<boolean>(false);
    const tableRef = React.useRef<CustomTableRef>(null);
    React.useEffect(() => {
      setInnerOpen(open);
    }, [open]);

    const drawClose = (
      evt: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
    ) => {
      setInnerOpen(false);
      onClose(evt);
    };

    const refreshClick = () => {
      tableRef.current?.refresh();
    };

    const innerExtra = (): React.ReactNode => {
      return (
        <Space>
          <Button type="primary" onClick={refreshClick}>
            刷新
          </Button>
        </Space>
      );
    };

    return (
      <Drawer
        open={innerOpen}
        {...props}
        onClose={drawClose}
        extra={props.extra || innerExtra()}
        className={`${className} draw-box`}
      >
        {props.children}
        {!props.children && type === 'table' && innerOpen && (
          <Table
            {...{
              ...tableConfig,
              mapToUrl: false,
            }}
            ref={tableRef}
          ></Table>
        )}
      </Drawer>
    );
  },
);

DrawBox.displayName = 'DrawBox';

export default DrawBox;
