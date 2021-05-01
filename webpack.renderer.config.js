const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      [path.join(__dirname, 'node_modules/sqlite3/lib/sqlite3-binding.js')]: path.join(__dirname, 'build_helpers/sqlite3-binding.js'),
    },
  },
};
