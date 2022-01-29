// Model for the User
module.exports = (mongoose) => {
    var UserSchema = mongoose.Schema({
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
            required: [true, "You must supply the user's password"],
            minlength: [5, "Your password must be at least 8 letters."],
        },
        requests: [mongoose.Schema.Types.ObjectId],
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
        rights: [
            {
                type: String,
            },
        ],
    });

    /**
     * Remove the request from the user's request list.
     */
    UserSchema.methods.removeRequest = function (userId, requestId, cb) {
        return mongoose
            .model("user")
            .update({ _id: userId }, { $pull: { requests: requestId } }, cb);
    };

    return mongoose.model("user", UserSchema);
};
