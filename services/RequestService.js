const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("request");
const httpError = require("http-errors");
// Check if the ID given is a valid MongoDB ObjectID
const isIdValid = require("./utilities").isIdValid;

class RequestService {
    /**
     * @description Create an instance of the RequestService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    /**
     *  Create a request and save it to the Request collection.
     *
     * @param {Request} requestToCreate
     * @returns {httpError} 200 If creating the Request is successful.
     * @returns {httpError} 404 If creatiing the Request is unsuccessful.
     */
    async createRequest(requestToCreate) {
        if (!validateRequest(requestToCreate)) {
            throw httpError(400, "Request data is invalid.");
        }

        model
            .findByUsername(requestToCreate.requestingUser)
            .then((data) => {
                const requestingUser = data[0];

                const request = {
                    name: requestToCreate.name,
                    cost: requestToCreate.cost,
                    author: requestToCreate.author,
                    type: requestToCreate.type,
                    requestingUser: requestingUser._id,
                    history: requestToCreate.history,
                };

                return this.mongooseService
                    .create(request)
                    .then((data) => {
                        model.saveRequestToUser(requestingUser, data._id);
                    })
                    .catch((error) => {
                        throw httpError(404, error.message);
                    });
            })
            .catch(() => {
                throw httpError(404, "Username does not exist.");
            });
    }

    /**
     * Find all Requests.
     *
     * @returns {Array} Returns array of Requests that were found.
     */
    async findAllRequests() {
        return this.mongooseService.findAll();
    }

    /**
     *  Find a request.
     *
     * @param {String} requestToFind
     * @returns {httpError} 200 If finding the Request is successful.
     * @returns {httpError} 404 If no Request is found.
     */
    async findRequest(requestToFind) {
        if (!isIdValid(requestToFind)) {
            throw httpError(404, "Request ID is invalid.");
        }
        return this.mongooseService.findById(requestToFind).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Find a request by params
     *
     * @param {String} params The params to search for
     * @returns {httpError} 200 If finding the Request is successful.
     * @returns {httpError} 404 If no Request is found.
     */
    async findRequestByParams(params) {
        return this.mongooseService.findByProperty(params).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Update a request.
     *
     * @param {String} requestToUpdate
     * @param {Object} to_update
     * @returns {httpError} 200 If updating the Request is successful.
     * @returns {httpError} 404 If request could not be updated.
     */
    async updateRequest(requestToUpdate, to_update) {
        if (!isIdValid(requestToUpdate)) {
            throw httpError(404, "Request ID is invalid.");
        }
        if (!isValidateUpdate(to_update)) {
            throw httpError(
                400,
                "Request history must be included. See documentation for structure."
            );
        }
        return this.mongooseService
            .update(requestToUpdate, to_update)
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     *  Delete a request.
     *
     * @param {String} requestToDelete
     * @returns {httpError} 200 If deleteing the Request is successful.
     * @returns {httpError} 404 If request could not be deleted.
     */
    async deleteRequest(requestToDelete) {
        if (!isIdValid(requestToDelete)) {
            throw httpError(404, "Request ID is invalid.");
        }
        // if (!isValidDeleteRequest(requestToDelete)) {
        //     throw httpError(
        //         400,
        //         "You are no longer allowed to cancel this request."
        //     );
        // }

        return this.mongooseService
            .deleteById(requestToDelete)
            .then(() => {
                model.findByUserByRequest(requestToDelete).then((users) => {
                    let user = users[0];
                    user.removeRequest(user._id, requestToDelete, (error) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log("Sucessfully removed request from user.");
                    });
                });
            })
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     *  Delete a request.
     *
     * @returns {httpError} 200 If deleteing the Requests is successful.
     */
    async deleteAllRequests() {
        return this.mongooseService.deleteAll();
    }
}

/**
 *  Validates the data in a Request.
 *
 * @returns {Boolean} True if the object maps correct to the Request model.
 */
function validateRequest(request) {
    if (
        !request ||
        !request.name ||
        !request.cost < 0 ||
        !request.author ||
        !request.requestingUser
    ) {
        return false;
    } else if (
        request.type != "Book" &&
        request.type != "Audiobook" &&
        request.type != "Magazine"
    ) {
        return false;
    } else {
        return true;
    }
}

/**
 *  Validates the data in a  delete Request.
 *
 * @returns {Boolean} True if request is not in certain statuses.
 */
function isValidDeleteRequest(request) {
    if (
        request.status == "Pending Review" ||
        request.status == "Approved" ||
        request.status == "Declined"
    ) {
        return true;
    }
    return false;
}

/**
 *  Validates the data in a update Request.
 *
 * @returns {Boolean} True if the object contains required info.
 */
function isValidateUpdate(update) {
    if (update.history) {
        return true;
    }
    return false;
}

module.exports = RequestService;
