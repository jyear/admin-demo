import Excep from '@/pages/excep';
import Login from '@/pages/login';

const config: Array<RouteItem> = [
  {
    element: <Login></Login>,
    path: '/login',
    meta: {
      title: '登录',
    },
    useLayer: false,
    key: 'Login',
  },
  {
    element: <Excep></Excep>,
    path: '*',
    key: 'Excep',
    meta: {
      title: '异常',
    },
    useLayer: false,
  },
];

export default config;
