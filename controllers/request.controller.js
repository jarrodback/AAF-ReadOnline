const db = require("../models");
const Request = db.requests;

// Create and Save a new Request
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Request model object
    const request = new Request({
        name: req.body.name,
        datePublished: req.body.datePublished,
        cost: req.body.cost,
        author: req.body.author,
        audiobook: req.body.audiobook,
        requestingUser: req.body.requestingUser,
    });

    // Save Request in the database
    request
        .save()
        .then((bookData) => {
            console.log("Request saved in the database: " + bookData);
            // Now update the user by adding the association
            console.log();
            db.users
                .findByIdAndUpdate(
                    request.requestingUser, //We assume userid is an attribute in the JSON
                    { $push: { requests: bookData._id } },
                    { new: true, useFindAndModify: false }
                )
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
                    "Some error occurred while creating the Request.",
            });
        });
};

// Retrieve all Requests from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    //We use req.query.name to get query string from the Request and
    // consider it as condition for findAll() method.
    var condition = name
        ? { name: { $regex: new RegExp(name), $options: "i" } }
        : {};
    Request.find(condition)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving the Request.",
            });
        });
};

// Find a single Request with an id
exports.findOne = (req, res) => {};

// Update a Request by the id in the request
exports.update = (req, res) => {};

// Delete a Request with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Request from the database.
exports.deleteAll = (req, res) => {};
