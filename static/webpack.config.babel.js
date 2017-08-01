import path from 'path';

module.exports = {
  entry: './frontend/javascripts/app.js',
  output: {
    filename: 'app.js',
    path: __dirname + '/build/javascripts'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve('./frontend/javascripts'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2015'
    }]
  },
  cache: true
};
