// import { Button } from 'antd';
import React from 'react';
import Edit from '@/components/edit';
import Table, { FilterItem } from '@/components/table';
import { filterItems, columns, editForm } from './dataset';
import './index.less';

const Home = () => {
  const [FilterItems] = React.useState<FilterItem[]>(filterItems);
  const [isShowEdit, setIsShowEdit] = React.useState(false);
  const [editData, setEditData] = React.useState({
    datetimerange: '扎根三麦当娜萨满的',
  });

  const requestData = params => {
    return new Promise(resolve => {
      setTimeout(() => {
        const len = Math.random() * 100;
        const list: any = [];
        for (let i = 0; i < len; i++) {
          list.push({
            name: Math.random(),
            age: Math.random(),
            id: i,
            address: '23',
          });
        }
        resolve({
          list,
          total: list.length,
        });
      }, 2000);
    });
  };

  const editOk = res => {
    console.log('res', res);
    // return 'success';
    return new Promise(resolve => {
      setTimeout(() => {
        setIsShowEdit(false);
        resolve('success');
      }, 2000);
    });
  };

  return (
    <div style={{ height: '100%' }} className="test">
      <Table
        api={requestData}
        filterItems={FilterItems}
        columns={[
          ...columns,
          {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: () => <a onClick={() => setIsShowEdit(true)}>action</a>,
          },
        ]}
        mapToUrl={false}
      ></Table>
      <Edit
        data={editData}
        open={isShowEdit}
        forms={editForm}
        onOk={editOk}
        onCancel={() => setIsShowEdit(false)}
        title="编辑"
      ></Edit>
    </div>
  );
};

export default Home;
