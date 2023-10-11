const config = {
  DEV: {},
  TEST: {},
  PROD: {},
};

export default config[process.env.RUNTIME_ENV || 'DEV'];
