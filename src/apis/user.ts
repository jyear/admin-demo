const apis = {
  getUserInfo: {
    path: '/user/info',
    method: 'get',
  },
};

type ApiType = keyof User.Apis;

export default apis as Record<ApiType, ApiConfig>;
