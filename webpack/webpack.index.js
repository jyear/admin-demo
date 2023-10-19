const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootPath = path.resolve(__dirname, '../');

const isDev = process.env.RUNTIME_ENV === 'DEV';

const config = {
  entry: {
    app: path.resolve(__dirname, '../src/main.tsx'),
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.tsx', '.ts', '.less', '.css'],
    alias: {
      '@': path.resolve(rootPath, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css|less$/,
        use: [
          isDev
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: false,
                },
              },
          {
            loader: 'css-loader',
            options: {},
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              env: {
                targets: {
                  chrome: '79',
                },
              },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  dynamicImport: true,
                  tsx: true,
                  privateMethod: false,
                  functionBind: false,
                  exportDefaultFrom: false,
                  exportNamespaceFrom: false,
                  decorators: true,
                  decoratorsBeforeExport: false,
                  topLevelAwait: true,
                  importMeta: false,
                },
                transform: {
                  legacyDecorator: true,
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.png|jpg|jpeg$/,
        type: 'asset/resource',
        generator: { filename: 'images/[hash][ext]' },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`, //生成的文件名
      template: path.resolve(__dirname, `../public/index.html`), //源文件的绝对路径
    }),
    new webpack.DefinePlugin({
      'process.env': {
        RUNTIME_ENV: JSON.stringify(process.env.RUNTIME_ENV),
      },
    }),
  ],
};

module.exports = config;
