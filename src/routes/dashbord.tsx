import { DashboardOutlined } from '@ant-design/icons';

const config: Array<RouteItem> = [
  {
    element: () => import('@/pages/home'),
    path: '/',
    meta: {
      title: 'Dashbord',
    },
    useLayer: true,
    withAuth: false,
    key: 'Dashbord',
  },
];

export const menu: MenuItem[] = [
  {
    label: '首页',
    key: 'Dashbord',
    icon: <DashboardOutlined />,
    path: '/',
  },
];

export default config;
