// Model for the book Request
module.exports = (mongoose) => {
    var Request = mongoose.model(
        "request",
        mongoose.Schema({
            name: {
                type: String,
                required: [true, "You must supply the name of the book."],
            },
            datePublished: {
                type: Date,
                required: true,
                required: [
                    true,
                    "You must supply the publishcation date of the book.",
                ],
            },
            cost: {
                type: Number,
                required: [true, "You must supply the cost of the book."],
            },
            author: {
                type: String,
                required: [true, "You must supply the author of the book."],
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
                required: true,
            },
            status: {
                type: String,
                enum: {
                    values: [
                        "Pending Review",
                        "In Review",
                        "New Information Required",
                        "Accepted",
                        "Denied",
                    ],
                    message: "{VALUE} is not valid.",
                    default: "Pending Review",
                },
            },
        })
    );
    return Request;
};
