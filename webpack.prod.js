const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            /* babel loader for converting ES6 syntax */
            {
                test: /\.js$/,                  /* apply for JS files */
                exclude: "/node_modules/",      /* excludes module from /node_modules/ */
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            }
        ]
    }
})