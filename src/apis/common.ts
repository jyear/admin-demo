const apis = {
  getPermission: {
    path: '/user/permissions',
    method: 'get',
  },
};

type ApiType = keyof Common.Apis;

export default apis as Record<ApiType, ApiConfig>;
