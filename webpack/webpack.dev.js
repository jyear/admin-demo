const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.index.js');
const path = require('path');

const devConfig = {
  mode: 'development',
  devServer: {
    port: '8999',
    historyApiFallback: true,
  },
  module: {
    rules: [],
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'js/[id].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
  },
};

module.exports = webpackMerge.merge(baseConfig, devConfig);
