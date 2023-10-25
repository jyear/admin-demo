import config from '@/config';
import requset from '@/utils/request';
import Common from './common';
import User from './user';

const files = {
  Common,
  User,
};
const apiObj = {};

Object.keys(files).forEach((key: string) => {
  const apis = files[key];
  if (!apiObj[key]) {
    apiObj[key] = {};
  }
  Object.keys(apis).map((apiKey: string) => {
    apiObj[key][apiKey] = function (
      data: unknown,
      option: unknown,
    ): Promise<unknown> {
      const apiItem = apis[apiKey];
      const method = apiItem.method || 'get';
      const path = apiItem.path.startsWith('http')
        ? apiItem.path
        : `${config.api}${apiItem.path}`;
      return requset[method](path, data, option);
    };
  });
});

export default apiObj as Apis;
