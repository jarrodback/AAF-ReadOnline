const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "babel-loader",
                loader: "vue-loader",
            },
        ],
    },
    plugins: [new VueLoaderPlugin()],
};
