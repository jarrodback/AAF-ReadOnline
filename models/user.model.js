// Model for the User
module.exports = (mongoose) => {
    var User = mongoose.model(
        "user",
        mongoose.Schema({
            username: {
                type: String,
                required: [true, "You must supply the user's username."],
                minlength: [5, "Your username must be at least 5 letters."],
                unique: [true, "The username must be unique."],
            },
            email: {
                type: String,
                required: [true, "You must supply the user's email."],
                unique: [true, "The email must be unique."],
            },
            password: {
                type: String,
                required: true,
            },
            requests: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "request",
                },
            ],
            role: {
                type: String,
                required: [true, "You must supply the user's role."],
                enum: {
                    values: ["User", "Employee", "Admin"],
                    message:
                        "{VALUE} is not valid. Must be either `User`, `Employee`, or `Admin`.",
                },
            },
            dateCreated: {
                type: Date,
                required: [true, "You must supply the user's creation date."],
                default: Date.now,
            },
        })
    );
    return User;
};
