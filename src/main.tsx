import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import '@/assets/less/reset.less';
import Routes from '@/routes';
import store from '@/store';

// const debounce = (callback: any, delay: number) => {
//   let tid: any;
//   return function (...arg) {
//     const ctx = self;
//     tid && clearTimeout(tid);
//     tid = setTimeout(() => {
//       callback.apply(ctx, arg);
//     }, delay);
//   };
// };

// export default () => {
//   const _ = (window as any).ResizeObserver;
//   (window as any).ResizeObserver = class ResizeObserver extends _ {
//     constructor(callback: any) {
//       callback = debounce(callback, 20);
//       super(callback);
//     }
//   };
// };

// import App from './app';

const el = document.querySelector('#root');
const Root = ReactDOM.createRoot(el as Element);
Root.render(
  <ConfigProvider locale={locale}>
    <Provider store={store}>
      <Routes></Routes>
    </Provider>
  </ConfigProvider>,
);
