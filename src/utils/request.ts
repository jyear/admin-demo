import { message } from 'antd';
import axios from 'axios';

const instance = axios.create({
  baseURL: '',
});

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    //   config.headers.set('X-Access-Token', state.user.token);
    //   config.headers.set(
    //     'X-Lang',
    //     state.framework.language === 'zh' ? 'zh_CN' : 'en_US',
    //   );
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log(`${response.config.url}`, response.data, response.config);
    switch (response.data.code) {
      case 1002: // 其他设备登录
        message.error('错误');
        break;
      case 0:
        return response.data.data;
      default:
        break;
    }

    // 需要强制退出
    if ([1000, 1001, 1002].includes(response.data.code)) {
      //  退出
    }

    // 对响应数据做点什么
    return Promise.reject(response.data);
  },
  function (error) {
    message.error('错误');
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

const methds: Record<
  Method,
  ((url: string, data: any, option: any) => Promise<Response>) | null
> = {
  get: null,
  post: null,
};

(['get', 'post'] as Method[]).forEach((key: Method) => {
  methds[key] = (
    url: string,
    data: any,
    option: any = {},
  ): Promise<Response> => {
    if (key === 'get') {
      option.params = data;
    }
    if (key === 'post') {
      option.data = data;
    }
    return instance.request({
      url,
      method: key,
      ...option,
    });
  };
});

export default methds;
