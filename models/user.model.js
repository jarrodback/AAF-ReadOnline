module.exports = (mongoose) => {
    var User = mongoose.model(
        "user",
        mongoose.Schema({
            username: {
                type: String,
                required: true,
                lowercase: true,
                unique: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            requests: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "request",
                },
            ],
            dateCreated: {
                type: Date,
                required: true,
                default: Date.now,
            },
        })
    );
    return User;
};
