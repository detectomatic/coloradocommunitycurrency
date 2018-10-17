const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const   plugins = [
  new HtmlWebpackPlugin({filename:'index.html', template: 'index.html'}),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({APP_ROOT : "'/'"}),
  new webpack.DefinePlugin({API_ENDPOINT : process.env.NODE_ENV === 'production' ? "'https://betaapi-dot-dcoin-web-app.appspot.com/'" : "'http://localhost:3001/'"})
];

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath : '/',
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
            "style-loader",
            "css-loader",
            "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
            "style-loader",
            "css-loader"
        ]
      },
      {
        test: /\.(png|gif|jpg)$/,
        exclude: /node_modules/,
        use : ['file-loader?name=[name].[ext]&outputPath=assets/images/'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        include: '/build/contracts/EcoAllyBase.json',
        use : ['json-loader']
        
      },
      { 
        test: /.(ttf|eot|svg|woff(2)?)(\S+)?$/,
        loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
        '~' : path.resolve( __dirname, 'src' )
    },
  },
  mode: 'development'
};