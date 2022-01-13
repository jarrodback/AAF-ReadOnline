// Model for the book Request
module.exports = (mongoose) => {
    var Request = mongoose.model(
        "request",
        mongoose.Schema({
            name: {
                type: String,
                required: [true, "You must supply the name of the book."],
                minlength: [1, "The book name must be at least 1 letter."],
            },

            datePublished: {
                type: Date,
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
                    values: ["Book", "Audiobook"],
                    message:
                        "{VALUE} is not valid. The type must be either 'Book' or 'Audiobook'",
                },
            },
            requestingUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: [true, "You must supply the requesting user."],
            },
            status: {
                required: [true, "You must supply the status of the request."],
                type: String,
                enum: {
                    values: [
                        "Pending Review",
                        "In Review",
                        "New Information Required",
                        "Accepted",
                        "Denied",
                    ],
                    message:
                        "{VALUE} is not valid. You must supply a valid request status.",
                },
                default: "Pending Review",
            },
        })
    );
    return Request;
};
