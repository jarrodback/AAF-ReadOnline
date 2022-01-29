// Model for the config table
module.exports = (mongoose) => {
    var Config = mongoose.model(
        "config",
        mongoose.Schema({
            _id: false,
            costThreshold: {
                type: Number,
                minimum: [0, "The cost threshold cannot be below 0."],
                default: 100,
                required: [true, "The cost threshold must be supplied."],
            },
        })
    );
    return Config;
};
