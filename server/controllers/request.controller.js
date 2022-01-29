const { param } = require("../routes/request.routes.js");
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
        .then(() => {
            console.log("Request has been saved in the database.");

            res.status(200).send({
                message: "Request was successfully created.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Find all Requests from the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    const url = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
    );
    let params = new URLSearchParams(url.search);
    params = Object.fromEntries(params);

    requestService
        .findRequestByParams(params)
        .then((data) => {
            let paramsCount = { ...params };
            if (paramsCount.offset || paramsCount.limit) {
                delete paramsCount.offset;
                delete paramsCount.limit;
            }
            requestService.count(paramsCount).then((count) => {
                let totalPages = Math.ceil(count / params.limit);
                // Return data about pagination.
                const returnData = {
                    data: data,
                    totalPages: totalPages,
                    count: count,
                };
                res.send(returnData);
            });
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};

/**
 * Find a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findRequest = (req, res) => {
    // Get the request Id from the body
    requestService
        .findRequest(req.params.id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Update a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    requestService
        .updateRequest(req.params.id, req.body, req.session)
        .then((data) => {
            res.status(200).send({
                message: "Request was successfully updated.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
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
        .then(() => {
            res.status(200).send({
                message: "Request was successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Delete all Requests
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    requestService
        .deleteAllRequests()
        .then(() => {
            res.status(200).send({
                message: "Requests were successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Requests.",
            });
        });
};
