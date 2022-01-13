const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("request");
const isIdValid = require("./utilities").isIdValid;
const httpError = require("http-errors");

class RequestService {
    /**
     * @description Create an instance of the RequestService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    async createRequest(requestToCreate) {
        if (!validateRequest(requestToCreate)) {
            throw httpError(400, "Request data is invalid.");
        }
        const request = {
            name: requestToCreate.name,
            datePublished: requestToCreate.datePublished,
            cost: requestToCreate.cost,
            author: requestToCreate.author,
            type: requestToCreate.type,
            requestingUser: "61dd56a297402ee89224efb2", //TODO Remove this: requestToCreate.requestingUser,
        };
        return this.mongooseService.create(request);
    }

    async findAllRequests() {
        return this.mongooseService.findAll();
    }

    async findRequest(requestToFind) {
        if (!isIdValid(requestToFind)) {
            throw httpError(404, "Request ID is invalid.");
        }
        return this.mongooseService.findById(requestToFind).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    async updateRequest(requestToUpdate, to_update) {
        if (!isIdValid(requestToUpdate)) {
            throw httpError(404, "Request ID is invalid.");
        }
        const request_id = { id_: requestToUpdate };
        return this.mongooseService
            .update(request_id, to_update)
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    async deleteRequest(requestToDelete) {
        if (!isIdValid(requestToDelete)) {
            throw httpError(404, "Request ID is invalid.");
        }
        return this.mongooseService
            .deleteById(requestToDelete)
            .catch((error) => {
                console.log("this was caught v2");
                throw httpError(404, error.message);
            });
    }

    async deleteAllRequests() {
        return this.mongooseService.deleteAll();
    }
}

function validateRequest(request) {
    if (
        !request ||
        !request.name ||
        !request.cost ||
        !request.author //||
        // !request.requestingUser
    ) {
        return false;
    } else if (request.type != "Book" && request.type != "Audiobook") {
        return false;
    } else {
        return true;
    }
}

module.exports = RequestService;
