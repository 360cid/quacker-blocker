const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js',
    popup: './ui/popup.js'
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: 'assets', to: path.resolve(__dirname, 'dist/assets') },
      { from: 'sources', to: path.resolve(__dirname, 'dist/sources') },
      { from: 'manifest.json', to: path.resolve(__dirname, 'dist/manifest.json') },
      { from: 'ui/popup.html', to: path.resolve(__dirname, 'dist/popup.html') },
      { from: 'ui/popup.css', to: path.resolve(__dirname, 'dist/popup.css') }
    ])
  ]
}
