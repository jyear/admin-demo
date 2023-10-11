import Home from '@/pages/home';

const config: Array<RouteItem> = [
  {
    element: <Home></Home>,
    path: '/',
    meta: {
      title: '首页',
    },
    useLayer: true,
  },
];

export default config;
