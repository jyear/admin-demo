const config = {
  DEV: {
    api: 'http://wallet-admin-test-api.flipped.space',
  },
  TEST: {
    api: 'http://wallet-admin-test-api.flipped.space',
  },
  PROD: {
    api: 'https://wallet-admin-api.flipped.ltd',
  },
};

export default config[process.env.RUNTIME_ENV || 'DEV'];
