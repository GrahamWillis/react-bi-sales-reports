const config = {
  mode: 'none',
  entry: [ './client/index.js' ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: { loader: 'url-loader' }
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js'
  }
}

module.exports = config
