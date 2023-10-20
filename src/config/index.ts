const config = {
  DEV: {
    api: 'https://baidu.com',
  },
  TEST: {
    api: 'https://baidu.com',
  },
  PROD: {
    api: 'https://baidu.com',
  },
};

export default config[process.env.RUNTIME_ENV || 'DEV'];
