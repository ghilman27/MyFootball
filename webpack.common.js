const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/index.js",
        worker: "./src/worker.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                /* app global css loader */
                test: /(?<!\.module).css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                /* component css loader */
                test: /\.module\.css$/,
                use: ["handlebars-loader"]
            },
            {
                /* component template html */
                test: /\.module\.html$/,
                use: "handlebars-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin ({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new CopyWebpackPlugin ({
            patterns: [
                {from: "./src/images", to: "images"},
                {from: "./src/pages", to: "pages"},
                {from: "./src/manifest.json", to: "./manifest.json"},
            ]
        }),
        new workboxPlugin.GenerateSW({
            swDest: 'worker.js',
            clientsClaim: true,
            skipWaiting: true,
        }),
    ]
}