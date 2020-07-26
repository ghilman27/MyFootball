const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        index: "./src/index.js",
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
        new CleanWebpackPlugin(),
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
        new workboxPlugin.InjectManifest({
            swSrc: "./src/worker.js",
            swDest: "worker.js",
        }),
    ]
}