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
    sourceMap: true,
  },
}

const cache = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: '.webpack-cache',
  },
}

const config = {
  mode: 'production',
  entry: {
    'theme-basic': './src/themes/basic/index.js',
    'plugin-sample': './src/plugins/sample/index.js',
    'plugin-ess-form': './src/plugins/ess/form/index.js',
    'plugin-ess-editor': './src/plugins/ess/editor/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[contenthash:6].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          cache,
          'vue-loader',
        ],
      },
      {
        test: /\.js$/,
        use: [
          cache,
          'babel-loader',
        ],
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'node_modules/@material'),
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },      
      {
        test: /\.less$/,
        use: [
          extractCss,
          cache,
          'css-loader?sourceMap',
          'less-loader?sourceMap',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          extractCss,
          cache,
          'css-loader?sourceMap',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          extractCss,
          cache,
          'css-loader?sourceMap',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.mjs',
      '.js',
      '.vue',
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:6].css',
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: {inline: false, annotation: true},
      },
    }),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
      filename: 'plugin-ess-editor.html',
      chunks: ['plugin-ess-editor'],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
      filename: 'index.html',
      chunks: ['plugin-ess-editor'],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
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
  node: {
    fs: 'empty',
    path: 'empty',
  },
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
