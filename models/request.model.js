// Model for the book Request
module.exports = (mongoose) => {
    var RequestSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true, "You must supply the name of the book."],
            minlength: [1, "The book name must be at least 1 letter."],
        },
        dateCreated: {
            type: Date,
            required: [
                true,
                "You must supply the creation date of the request.",
            ],
            default: Date.now,
        },
        cost: {
            type: Number,
            required: [true, "You must supply the cost of the book."],
            minimum: [0, "The cost of the book cannot be less than 0"],
        },
        author: {
            type: String,
            required: [true, "You must supply the author of the book."],
            minlength: [1, "The author name must be at least 1 letter."],
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: ["Book", "Audiobook", "Magazine"],
                message:
                    "{VALUE} is not valid. The type must be either 'Book' or 'Audiobook' or 'Magazine'",
            },
        },
        requestingUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "You must supply the requesting user."],
        },
        status: {
            required: [true, "You must supply the status of the request."],
            type: String,
            enum: {
                values: [
                    "Pending Review",
                    "In Review",
                    "Needs More Information",
                    "Approved",
                    "Declined",
                    "Purchased",
                ],
                message:
                    "{VALUE} is not valid. You must supply a valid request status.",
            },
            default: "Pending Review",
        },
        reviewingUser: {
            type: String,
            default: "",
        },
        previousReviewer: {
            type: String,
        },
        reviewComments: {
            type: String,
        },
        additionalInformation: {
            type: String,
        },
        history: {
            type: Array,
        },
    });

    /**
     * Static method to find the object of the username sent in the request.
     */
    RequestSchema.statics.findByUsername = function (username) {
        return mongoose.model("user").find({ username: username });
    };

    /**
     * Static method to find the object of the username from request id.
     */
    RequestSchema.statics.findByUserByRequest = function (idRequest) {
        return mongoose.model("user").find({
            requests: { $in: { _id: mongoose.Types.ObjectId(idRequest) } },
        });
    };

    /**
     * Static method to save the request into the user requests field.
     */
    RequestSchema.statics.saveRequestToUser = function (user, requestId) {
        user.requests.push(requestId);
        return user.save();
    };

    /**
     * Static method to verify the user's role.
     */
    RequestSchema.statics.checkRole = function (role) {
        return (
            mongoose.model("user").find({ username: username })[0].role == role
        );
    };

    return mongoose.model("request", RequestSchema);
};
