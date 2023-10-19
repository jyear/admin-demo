import { DashboardOutlined } from '@ant-design/icons';

// import Home from '@/pages/home';

const config: Array<RouteItem> = [
  {
    element: () => import('@/pages/home'),
    // element: <Home></Home>,
    path: '/',
    meta: {
      title: 'Dashbord',
    },
    useLayer: true,
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
