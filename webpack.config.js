const path = require('path')
const package = require('./package.json')
const webpack = require('webpack')
const ejs = require('ejs');

const VueHtmlWebpackPlugin = require('vue-html-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin')

const stylusPlugins = [
  // require('rupture')(),
  require('svg-stylus')()
]

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = (env) => {
  // const { variant } = env
  const { version, name, description } = package
  const distDir = `dist`

  return {
    mode: 'production',
    entry: {
      'background': './src/background.js',
      'content': './src/content.js',
      'popup/popup': './src/popup.js',
      'options/options': './src/options.js',
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: '[name].js',
    },
    node: {
      fs: 'empty'
    },
    externals: {
      // puppeteer: ["puppeteer"],
      // ...
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.styl(us)?$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
            'postcss-loader',
            'stylus-loader',
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),

      // new webpack.DefinePlugin({
      //   'VARIANT': JSON.stringify(variant)
      // }),

      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          stylus: {
            use: stylusPlugins,
            preferPathResolver: 'webpack',
            options: ['resolve url']
          }
        }
      }),

      new CopyPlugin([
        {
          from: 'src/manifest.json',
          transform: contents => {
            const o = JSON.parse(contents)
            o.name = `${capitalize(name)}`
            o.description = description
            o.version = version
            return JSON.stringify(o)
          }
        },
        { from: 'src/popup.html', to: 'popup.html', transform: transformHtml },
        // {
        //   from: 'sounds/*.mp3',
        //   to: 'assets/',
        //   context: 'src/assets/'
        // },
        {
          from: `icons/icon_128.png`,
          to: 'assets/icon_128.png',
          context: 'src/assets/'
        }
      ]),
      // new HtmlWebpackPlugin({
      //   filename: path.resolve(__dirname, `${distDir}/index.html`),
      //   template: './src/index.html',
      //   inject: true,
      //   minify: {
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     removeAttributeQuotes: true
      //     // more options:
      //     // https://github.com/kangax/html-minifier#options-quick-reference
      //   },
      //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      //   chunksSortMode: 'dependency'
      // }),
      // new VueHtmlWebpackPlugin({
      //   vue: true
      // }),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),

      new ZipPlugin({
        path: '../',
      })
    ]
  }
}
