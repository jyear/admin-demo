const apis = {
  login: {
    path: '/admin/login/sms',
    method: 'post',
  },
  getUserInfo: {
    path: '/user/info',
    method: 'get',
  },
};

type ApiType = keyof User.Apis;

export default apis as Record<ApiType, ApiConfig>;
