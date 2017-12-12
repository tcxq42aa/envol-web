var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');

var env = process.env.NODE_ENV
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: env != 'development' ? 'http://static.envol.vip/dist/': '/dist/',
    filename: env != 'development' ? 'build-[hash].js' : 'build.js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': path.resolve(__dirname, './public')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          },
          include: [
            path.resolve(__dirname, './src'),
            path.resolve(__dirname, './node_modules/vuetify')
          ]
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './node_modules/vuetify')
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader?interpolate=require'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)\w*/,
        loader: 'url-loader?limit=1000000'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index-prod.html'),
      filename: 'index.ejs'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: '8081',
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin("styles.css?[contenthash]"),
    new ManifestPlugin({
      publicPath: 'http://static.envol.vip/dist/'
    })
  ])
  module.exports.module.rules = (module.exports.module.rules || []).concat([
    {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ["css-loader", "postcss-loader", "stylus-loader"]
      })
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    },
  ])
} else {
  module.exports.module.rules = (module.exports.module.rules || []).concat([
    {
      test: /\.styl$/,
      loader: ['style-loader', 'css-loader', 'stylus-loader']
    },
    {
      test: /\.css$/,
      loader: ['style-loader', 'css-loader']
    },
  ])
}
