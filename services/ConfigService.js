const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("config");
const httpError = require("http-errors");

class ConfigService {
    /**
     * @description Create an instance of the ConfigService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    /**
     * Find all config settings.
     *
     * @returns {Array} Returns array of config settings that were found.
     */
    async findAllSettings() {
        return this.mongooseService.findAll();
    }

    /**
     *  Update config.
     *
     * @param {Object} to_update The config settings to update
     * @returns {httpError} 200 If updating the config is successful.
     * @returns {httpError} 404 If config could not be updated.
     */
    async updateConfig(to_update) {
        if (!to_update) {
            throw httpError(400, "No update body.");
        }
        return this.mongooseService.update({}, to_update).catch((error) => {
            throw httpError(404, error.message);
        });
    }
}

module.exports = ConfigService;
