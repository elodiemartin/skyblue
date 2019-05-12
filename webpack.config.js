const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const LiveReloadPlugin = require('webpack-livereload-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './assets/js/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'build/js')
    },
    module: {
        rules: [{
            test: /\.s?[ac]ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { url: false, sourceMap: true } },
                { loader: 'sass-loader', options: { sourceMap: true } }
            ],
        },
        
        // {
        //     test: /\.js$/,
        //     exclude: /node_modules/,
        //     use: "babel-loader"
        // },
        // {
        //     test: /\.html$/,
        //     use: [
        //       {
        //         loader: "html-loader",
        //         options: { minimize: true }
        //       }
        //     ]
        // }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/style.css"
        }),
        // new HtmlWebPackPlugin({
        //     template: "./src/index.html",
        //     filename: "../index.html"
        // })
        
    ],
    mode : devMode ? 'development' : 'production',
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     compress: true,
    //     port: 8081
    // }
};
