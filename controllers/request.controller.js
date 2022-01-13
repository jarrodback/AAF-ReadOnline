const RequestService = require("../services/RequestService.js");
const requestService = new RequestService();

/**
 * Create a new book Request and save to the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */

exports.create = (req, res) => {
    requestService
        .createRequest(req.body)
        .then((data) => {
            console.log("Request has been saved in the database: " + data);

            if (data.success) {
                res.status(200).send({
                    message: "Request was successfully created.",
                });
            } else {
                res.status(400).send({
                    message: "Request was unable to be created.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while creating and saving the Request.",
            });
        });

    //         db.users
    //             .findByIdAndUpdate(
    //                 request.requestingUser,
    //                 { $push: { requests: bookData._id } },
    //                 { new: true, useFindAndModify: false }
    //             )
    //             // If found
    //             .then((userData) => {
    //                 console.log(`The updated user: ${userData}`);
    //                 res.send(bookData);
    //             });
    //     })
};

/**
 * Find all Requests from the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    // Find all data in the request collection with no condition to find al
    requestService
        .findAllRequests()
        .then((data) => {
            res.send(data);
        })
        .catch(() => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while finding the Request.",
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
    requestService
        .findRequest(req.params.id)
        .then((data) => {
            if (data.success) {
                res.send(data.body);
            } else {
                res.status(404).send();
            }
        })
        .catch(() => {
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
    requestService
        .updateRequest(req.params.id, req.body)
        .then((data) => {
            if (data.success) {
                res.status(200).send({
                    message: "Request was successfully updated.",
                });
            } else {
                res.status(400).send();
            }
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
    requestService
        .deleteRequest(req.params.id)
        .then((data) => {
            if (data.success) {
                res.status(200).send({
                    message: "Request was successfully deleted.",
                });
            } else {
                res.status(400).send();
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Request.",
            });
        });
    //         db.users
    //             .updateOne(
    //                 { requests: req.params.id },
    //                 {
    //                     $pull: {
    //                         requests: req.params.id,
    //                     },
    //                 }
    //             )
    //             .catch((err) => {
    //                 res.status(500).send({
    //                     message:
    //                         err.message ||
    //                         "An error occurred while deleteing the Request from the User.",
    //                 });
    //             });
};

/**
 * Delete all Requests
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    requestService
        .deleteAllRequests()
        .then((data) => {
            if (data.success) {
                res.status(200).send({
                    message: "Requests were successfully deleted.",
                });
            } else {
                res.status(400).send();
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Requests.",
            });
        });
};
