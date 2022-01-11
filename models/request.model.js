module.exports = (mongoose) => {
    var Request = mongoose.model(
        "request",
        mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            datePublished: {
                type: Date,
                required: true,
                default: Date.now,
            },
            cost: {
                type: Number,
                required: true,
            },
            author: {
                type: String,
                required: true,
            },
            audiobook: {
                type: Boolean,
                required: true,
                default: false,
            },
            requestingUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
                default: "61dd56a297402ee89224efb2",
            },
        })
    );
    return Request;
};
