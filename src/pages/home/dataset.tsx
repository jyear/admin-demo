import { Input } from 'antd';
import dayjs from 'dayjs';
import { FilterItem, CustomColumnsType } from '@/components/table';

export const filterItems: FilterItem[] = [
  {
    key: 'name',
    label: '名称',
    component: 'input',
    defaultValue: '',
  },
  {
    key: 'date',
    label: '名称名称名称',
    component: 'date',
    defaultValue: '',
    decode: (val: string) => dayjs(val || ''),
    props: {
      format: 'YYYY-MM-DD',
    },
  },
  {
    key: 'datetime',
    label: '名称名称名称',
    component: 'date',
    defaultValue: '',
    decode: (val: string) => dayjs(val || ''),
    props: {
      showTime: { format: 'YYYY-MM-DD HH:mm:ss' },
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    key: 'name1',
    label: '名称名称名称',
    component: 'select',
    defaultValue: null,
    decode: (val: string) => Number(val),
    mapValueLabel: {
      value: 'id',
      label: 'name',
    },
    option: [
      {
        id: 123,
        name: '张无忌',
      },
      {
        id: 1223,
        name: '张无忌22',
      },
    ],
  },
  {
    key: 'daterange',
    label: '名称',
    component: 'daterange',
    defaultValue: [],
    filterMap: ['startTime', 'endTime'],
  },
  {
    key: 'datetimerange',
    label: '名称',
    component: 'daterange',
    defaultValue: [],
    filterMap: ['startTime1', 'endTime1'],
    props: {
      showTime: { format: 'HH:mm' },
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    key: 'name4',
    label: '名称',
    render: ({ val, onChange }) => {
      const customOnchange = evt => {
        onChange(evt.target.value);
      };
      return <Input value={val as string} onChange={customOnchange}></Input>;
    },
    defaultValue: '',
  },
  {
    key: 'name5',
    label: '名称99',
    render: ({ val, onChange }) => {
      const customOnchange = evt => {
        onChange(evt.target.value);
      };

      return <Input value={val as string} onChange={customOnchange}></Input>;
    },
    defaultValue: '',
  },
];

export const columns: CustomColumnsType[] = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    overEllipise: true,
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    formatter: () => {
      return 123;
    },
  },
  {
    title: 'Column 1',
    dataIndex: 'index',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 1150,
  },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
];
