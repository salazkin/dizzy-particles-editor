const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        host: '127.0.0.1',
        historyApiFallback: true,
        port: 8015,
        open: true
    }
}
