const webpackMerge = require('webpack-merge');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const baseConfig = require('./webpack.index.js');
const path = require('path');

const componentsPath = path.join(__dirname, '../src/components');

const componentsDirs = fs.readdirSync(componentsPath);

const dynamicCache = {};
componentsDirs.map(name => {
  const toName = `${name}`;
  dynamicCache[toName] = {
    // type: 'css/mini-extract',
    test: new RegExp(`[\\\\/]components[\\\\/]${name}[\\\\/]`, 'i'),
    name: toName,
    chunks: 'all',
    enforce: true,
  };
});

const prodConfig = {
  mode: 'production',
  module: {
    rules: [],
  },
  // plugins: [new BundleAnalyzerPlugin()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData, assetInfo) => {
        return 'css/[name].[contenthash:8].css';
      },
      chunkFilename: 'css/[name].[contenthash:8].css',
      linkType: 'text/css',
      experimentalUseImportModule: true,
      ignoreOrder: false,
    }),
  ],
  output: {
    clean: true,
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        target: 'es2015',
        css: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        ...dynamicCache,
        defaultVendors: {
          name: 'node_modules',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|redux)[\\/]/,
          chunks: 'all',
          priority: -10,
          reuseExistingChunk: true,
        },
        // components: {
        //   name: module => {
        //     return 'components';
        //   },
        //   test: /[\\/]components[\\/]/,
        //   chunks: 'async',
        //   priority: -10,
        //   reuseExistingChunk: true,
        // },
        default: {
          name: 'default',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

module.exports = webpackMerge.merge(baseConfig, prodConfig);
