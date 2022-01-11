const db = require("../database");
const User = db.users;

/**
 * Create a user
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({ message: "Content can not be empty." });
        return;
    }

    // Create a User model object
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        requests: req.body.requests,
        dateCreated: req.body.dateCreated,
    });

    // Save User in the database
    user.save()
        .then((data) => {
            console.log("User saved in the database: " + data);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while creating the User.",
            });
        });
};

/**
 * Find all Users
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    User.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Users.",
            });
        });
};

/**
 * Find a User based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findOne = (req, res) => {
    // Get the user Id from the body
    const userId = { _id: req.params.id };

    // Search the collection for the user ID
    User.find(userId)
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while finding the User.",
            });
        });
};

/**
 * Update a User based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    // Get the user Id and the update fields from the body
    const userId = { _id: req.params.id };
    const update = req.body;

    // Search the collection for the user ID and update the fields
    User.findByIdAndUpdate(userId, update)
        .then((data) => {
            // Return the data once found and updated
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while updating the User.",
            });
        });
};

/**
 * Delete a User based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.delete = (req, res) => {
    // Get the request Id from the body
    const requestId = { _id: req.params.id };

    // Search the collection for the request ID and delete it
    User.deleteOne(requestId)
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the User.",
            });
        });
};

/**
 * Delete all Users
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    // Search the collection and delete all
    User.deleteMany()
        .then((data) => {
            // Return the data once found
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing all Users.",
            });
        });
};
