const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8081', // WebpackDevServer host and port
        'webpack/hot/only-dev-server',
        './index.jsx' // entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: loaders
    },
    devServer: {
        open: true,
        contentBase: "./public",
        https: false,
        disableHostCheck: true,
        port: 8081
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
