import Login from '@/pages/login';

const config: Array<RouteItem> = [
  {
    element: <Login></Login>,
    path: '/login',
    meta: {
      title: '登录',
    },
    useLayer: false,
  },
];

export default config;
