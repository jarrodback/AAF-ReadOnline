// Model for the User
module.exports = (mongoose) => {
    var Notification = mongoose.model(
        "notification",
        mongoose.Schema({
            message: {
                type: String,
                required: [true, "The message must be provided."],
            },
            username: {
                type: String,
                required: [true, "The user must be provided."],
            },
            read: {
                type: Boolean,
                default: false,
            },
        })
    );
    return Notification;
};
