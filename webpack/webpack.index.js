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
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                transform: {
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
    new MiniCssExtractPlugin({
      filename: isDev ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
    }),
  ],
};

module.exports = config;
