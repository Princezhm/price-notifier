const copyWebpackPlugin = require('copy-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const path = require('path');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './electron/electron.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [
        /.\//,
        /@sap\/hana-client/,
        /hdb-pool/,
        /mongodb/,
        /mssql/,
        /mysql/,
        /mysql2/,
        /oracledb/,
        /pg/,
        /pg-native/,
        /pg-query-stream/,
        /react-native-sqlite-storage/,
        /redis/,
        /sql.js/,
        /typeorm-aurora-data-api-driver/,
      ],
    }),
    new copyWebpackPlugin({
      patterns: [{ from: 'electron/assets', to: 'assets' }],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      [path.join(__dirname, 'node_modules/sqlite3/lib/sqlite3-binding.js')]: path.join(__dirname, 'build_helpers/sqlite3-binding.js'),
    },
  },
};
