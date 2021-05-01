const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
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
  new ForkTsCheckerWebpackPlugin(),
];
