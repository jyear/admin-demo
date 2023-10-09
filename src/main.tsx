import ReactDOM from 'react-dom/client';
import '@/assets/less/reset.less';
import App from './app';

const el = document.querySelector('#root');
const Root = ReactDOM.createRoot(el as Element);
Root.render(<App></App>);
