const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.index.js');
const path = require('path');

const devConfig = {
  mode: 'production',
  module: {
    rules: [],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].js',
  },
};

module.exports = webpackMerge.merge(baseConfig, devConfig);
