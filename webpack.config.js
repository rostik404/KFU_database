const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = {
    entry: __dirname + '/static/js/index.jsx',
    output: {
        path: __dirname + '/static/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),
    ]
};
module.exports = config;
