import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import '@/assets/less/reset.less';
import store from '@/store';
import App from './app';

const el = document.querySelector('#root');
const Root = ReactDOM.createRoot(el as Element);
Root.render(
  <ConfigProvider
    locale={locale}
    theme={{
      token: {
        borderRadius: 4,
        colorPrimary: '#00b96b',
      },
      components: {
        Menu: {
          collapsedWidth: 60,
        },
      },
    }}
  >
    <Provider store={store}>
      <App></App>
    </Provider>
  </ConfigProvider>,
);
