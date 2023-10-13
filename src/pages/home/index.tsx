// import { Button } from 'antd';
import React from 'react';
import Table, { FilterItem } from '@/components/table';
import { filterItems, columns } from './dataset';

const Home = () => {
  const [FilterItems] = React.useState<FilterItem[]>(filterItems);

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
          });
        }
        resolve({
          list,
          total: list.length,
        });
      }, 2000);
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <Table
        api={requestData}
        filterItems={FilterItems}
        columns={columns}
      ></Table>
    </div>
  );
};

export default Home;
