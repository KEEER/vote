// const webpack = require('webpack')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')

const extractCss = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    hmr: process.env.NODE_ENV === 'development',
    reloadAll: true,
  },
}

const config = {
  mode: 'production',
  entry: {
    'theme-basic': './src/themes/basic/index.js',
    // vote: './src/frontend/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[contenthash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'node_modules/@material')
        ],
      },
      {
        test: /\.less$/,
        use: [
          extractCss,
          // 'vue-style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          extractCss,
          // 'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          extractCss,
          // 'vue-style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.vue'
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:6].css',
    }),
    new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
      filename: 'index.html',
      chunks: ['vote'],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Theme Basic',
      filename: 'theme-basic.html',
      chunks: ['theme-basic'],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackTagsPlugin({
      links: [
        {path: 'https://fonts.loli.net/icon?family=Material+Icons', publicPath: false},
      ],
      scripts: [
        {path: 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.runtime.js', publicPath: false},
        'vote-config.js',
      ],
      append: false,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    watchOptions: {
      poll: true,
    },
    historyApiFallback: true,
  },
  devtool: 'source-map',
}

module.exports = config
