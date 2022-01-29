module.exports = {
    jest: {
        moduleFileExtensions: ["js", "json", "vue"],
        transform: {
            "^.+\\.js$": "babel-jest",
            "^.+\\.vue$": "vue-jest",
        },
        verbose: true,
        testURL: "http://localhost/",
    },
};
