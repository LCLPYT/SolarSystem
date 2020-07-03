const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundled/main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|html)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        },
      },
    ],
  },
};