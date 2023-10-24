// import { Button } from 'antd';
import React from 'react';
import Button from '@/components/button';
import DrawBox from '@/components/draw';
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
    console.log(112233, params);
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

  // filterItems={FilterItems}
  return (
    <div style={{ height: '100%' }} className="test">
      <Table
        api={requestData}
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
        filterItems={FilterItems}
        ctrls={
          <div>
            <Button type="primary" style={{ marginLeft: '10px' }}>
              新增
            </Button>
          </div>
        }
        mapToUrl={true}
      ></Table>
      {/* <Edit
        data={editData}
        open={isShowEdit}
        forms={editForm}
        onOk={editOk}
        onCancel={() => setIsShowEdit(false)}
        title="编辑"
      ></Edit> */}
      <DrawBox
        open={isShowEdit}
        width={'80%'}
        onClose={() => setIsShowEdit(false)}
        title={'text'}
        tableConfig={{
          columns: columns,
          api: requestData,
          tableKey: 'Home_Detail',
        }}
      ></DrawBox>
    </div>
  );
};

export default Home;
