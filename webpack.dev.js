const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        host: '127.0.0.1',
        historyApiFallback: true,
        port: 8015,
        open: true
    }
});
