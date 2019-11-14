const path = require('path')

module.exports = {
  entry: {
    app: './app.js',
    ui: './ui/popup.js'
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
