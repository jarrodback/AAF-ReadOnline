const MongooseService = require("./MongooseService.js");
const db = require("../database");
const createHttpError = require("http-errors");
const model = db.requests;

class RequestService {
    /**
     * @description Create an instance of the RequestService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    async createRequest(requestToCreate) {
        try {
            const request = {
                name: requestToCreate.name,
                datePublished: requestToCreate.datePublished,
                cost: requestToCreate.cost,
                author: requestToCreate.author,
                type: requestToCreate.type,
                requestingUser: "61dd56a297402ee89224efb2", //TODO Remove this: requestToCreate.requestingUser,
            };
            const result = await this.mongooseService.create(request);
            return { success: true, body: result };
        } catch (err) {
            return { success: false, body: err };
        }
    }

    async findAllRequests() {
        // try {
        //     const result = await this.mongooseService.findAll();
        //     return { success: true, body: result };
        // } catch (err) {
        //     return { success: false, body: err };
        // }
        return this.mongooseService.findAll();
    }

    async findRequest(requestToFind) {
        try {
            const request_id = { id_: requestToFind };
            const result = await this.mongooseService.findOne(request_id);
            return { success: "true", body: result };
        } catch (err) {
            return { success: "false", body: err };
        }
    }

    async updateRequest(requestToUpdate, to_update) {
        try {
            const request_id = { id_: requestToUpdate };
            const result = await this.mongooseService.update(
                request_id,
                to_update
            );
            return { success: "true", body: result };
        } catch (err) {
            return { success: "false", body: err };
        }
    }

    async deleteRequest(requestToDelete) {
        try {
            const request_id = { id_: requestToDelete };
            const result = await this.mongooseService.delete(request_id);
            return { success: "true", body: result };
        } catch (err) {
            return { success: "false", body: err };
        }
    }

    async deleteAllRequests() {
        try {
            const result = await this.mongooseService.deleteAll();
            return { success: "true", body: result };
        } catch (err) {
            return { success: "false", body: err };
        }
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
