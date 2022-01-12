const db = require("../database");
const Request = db.requests;

/**
 * Create a new book Request and save to the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.create = (req, res) => {
    // Check the request isn't empty
    if (
        !req.body.name ||
        (req.body.type != "Book" && req.body.type != "Audiobook")
    ) {
        res.status(400).send({ message: "Invalid Request data." });
        return;
    }
    // Create a Request model object
    const request = new Request({
        name: req.body.name,
        datePublished: req.body.datePublished,
        cost: req.body.cost,
        author: req.body.author,
        type: req.body.type,
        requestingUser: "61dd56a297402ee89224efb2", //req.body.requestingUser,
    });

    // Save the request in the database
    request
        .save()
        .then((bookData) => {
            console.log("Request has been saved in the database: " + bookData);

            // Update the user who submitted to the request to contain the request id
            db.users
                .findByIdAndUpdate(
                    request.requestingUser,
                    { $push: { requests: bookData._id } },
                    { new: true, useFindAndModify: false }
                )
                // If found
                .then((userData) => {
                    console.log(`The updated user: ${userData}`);
                    // Returning the new request
                    res.send(bookData);
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while creating and saving the Request.",
            });
        });
};

/**
 * Find all Requests from the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    // const userId = { _id: "61dd56a297402ee89224efb2" };

    // Find all data in the request collection with no condition to find all
    Request.find({})
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while finding all Requests.",
            });
        });
};

/**
 * Find a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findOne = (req, res) => {
    // Get the request Id from the body
    const requestId = { _id: req.params.id };

    // Search the collection for the request ID
    Request.find(requestId)
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while finding the Request.",
            });
        });
};

/**
 * Update a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    // Get the request Id and the update fields from the body
    const requestId = { _id: req.params.id };
    const update = req.body;

    // Search the collection for the request ID and update the fields
    Request.updateOne(requestId, update)
        .then((data) => {
            // Return the data once found and updated
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while updating the Request.",
            });
        });
};

/**
 * Delete a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.delete = (req, res) => {
    // Get the request Id from the body
    const requestId = { _id: req.params.id };

    // Search the collection for the request ID and delete it
    Request.deleteOne(requestId)
        .then((data) => {
            // Return the data once found
            db.users
                .updateOne(
                    { requests: req.params.id },
                    {
                        $pull: {
                            requests: req.params.id,
                        },
                    }
                )
                .then(() => {})
                .catch(() => {
                    res.status(500).send({
                        message:
                            err.message ||
                            "An error occurred while deleteing the Request from the User.",
                    });
                });
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Request.",
            });
        });
};

/**
 * Delete all Requests
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    // Search the collection and delete all
    Request.deleteMany()
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing all Requests.",
            });
        });
};
