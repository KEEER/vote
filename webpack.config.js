const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')

const isDev = process.env.NODE_ENV === 'development'
const srcPath = path.resolve(__dirname, 'src')

const extractCss = isDev ? 'style-loader' : {
  loader: MiniCssExtractPlugin.loader,
  options: {
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
  mode: process.env.NODE_ENV || 'production',
  entry: {
    'theme-basic': [ './src/themes/basic/index.js' ],
    'theme-default': [ './src/themes/default/index.js' ],
    'plugin-sample-form': [ './src/plugins/sample/form.js' ],
    'plugin-sample-editor': [ './src/plugins/sample/editor.js' ],
    'plugin-ess-form': [ './src/plugins/ess/form/index.js' ],
    'plugin-ess-editor': [ './src/plugins/ess/editor/index.js' ],
    'plugin-breakpoint': [ './src/plugins/breakpoint/index.js' ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name]-[contenthash:6].js',
    publicPath: process.env.PUBLIC_PATH || '/',
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
      isDev ? {} : {
        test: /\.js$/,
        exclude: /core-js|webpack|babel/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ [
              '@babel/preset-env',
              { useBuiltIns: 'usage', corejs: 3 },
            ] ],
            cacheDirectory: '.webpack-cache/babel',
            sourceType: 'unambiguous',
          },
        },
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
              includePaths: [ path.resolve(__dirname, 'node_modules') ],
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
    alias: {
      '@vote/core': srcPath,
      '@vote/api': path.resolve(srcPath, 'api'),
      '@vote/plugins': path.resolve(srcPath, 'plugins'),
      '@vote/themes': path.resolve(srcPath, 'themes'),
      '@vote/locale': path.resolve(__dirname, 'locale'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin(/^yaml$/),
    new webpack.NormalModuleReplacementPlugin(/^\.\/styles\.scss$/, resource => {
      if (/@keeer\/material-components-vue/.test(resource.context)) resource.request = '.'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? 'css/[name].css' : 'css/[name]-[contenthash:6].css',
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: { inline: false, annotation: true },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Vote Editor | KEEER Vote',
      filename: 'plugin-ess-editor.html',
      chunks: [ 'plugin-ess-editor' ],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
      filename: 'theme-basic.html',
      chunks: [ 'theme-basic' ],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'KEEER Vote',
      filename: 'theme-default.html',
      chunks: [ 'theme-default' ],
      xhtml: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new HtmlWebpackTagsPlugin({
      links: [
        { path: 'https://fonts.loli.net/icon?family=Material+Icons', publicPath: false },
      ],
      scripts: [
        { path: 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.runtime.js', publicPath: false },
        { path: 'https://cdn.jsdelivr.net/npm/vue-i18n@8.15.3/dist/vue-i18n.min.js', publicPath: false },
        { path: 'vote-config.js', publicPath: false },
      ],
      append: false,
    }),
    new HtmlWebpackInjectAttributesPlugin({ crossorigin: 'anonymous' }),
  ],
  node: {
    fs: 'empty',
    path: 'empty',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    watchOptions: {
      poll: true,
    },
    historyApiFallback: true,
  },
  devtool: isDev ? 'eval' : 'source-map',
  optimization: { concatenateModules: false },
}

module.exports = config
