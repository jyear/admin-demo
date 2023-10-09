const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const rootPath = path.resolve(__dirname, "../");

const config = {
  entry: {
    app: path.resolve(__dirname, "../src/main.tsx"),
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".tsx", ".ts", ".less", ".css"],
    alias: {
      "@": path.resolve(rootPath, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css|less$/,
        use: [
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "less-loader",
        ],
      },
      { test: /\.tsx?$/, use: "swc-loader" },
      {
        test: /\.png|jpg|jpeg$/,
        type: "asset/resource",
        generator: { filename: "images/[hash][ext]" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`, //生成的文件名
      template: path.resolve(__dirname, `../public/index.html`), //源文件的绝对路径
    }),
  ],
};

module.exports = config;
