class MongooseService {
    /**
     * @description Create an instance of the MongooseService.
     */

    constructor(model) {
        // Set the collections model to use.
        this.model = model;
    }

    /**
     * Create and save the record to the database.
     *
     * @param {Object} recordToCreate The Request to create.
     * @returns {Object} The created record.
     */
    async create(recordToCreate) {
        return this.model.create(recordToCreate);
    }

    /**
     * Find all records in the database.
     *
     * @returns {Array[Object]} The found records.
     */
    async findAll() {
        return this.model.find({});
    }

    /**
     * Find a record by ID in the database.
     *
     * @param {String} recordToFind The ID to find.
     * @returns {Object} The found record.
     * @returns {Error} The record could not be found.
     */
    async findById(recordToFind) {
        return this.model
            .findById(recordToFind)
            .orFail(() => new Error("Could not find record."));
    }

    /**
     * Find a record by property in the database.
     *
     * @param {String} propertyToFind The property to find.
     * @returns {Object} The found record.
     * @returns {Error} The record could not be found.
     */
    async findByProperty(propertyToFind) {
        return this.model
            .find(propertyToFind)
            .orFail(() => new Error("Could not find record."));
    }

    /**
     * Update a record by ID in the database.
     *
     * @param {String} recordToUpdate The ID to update.
     * @param {Object} to_update The data to update.
     * @returns {Object} The updated record.
     * @returns {Error} The record could not be found.
     */
    async update(recordToUpdate, to_update) {
        return this.model
            .findByIdAndUpdate(recordToUpdate, to_update)
            .orFail(() => new Error("Could not find record."));
    }

    /**
     * Delete a record by ID in the database.
     *
     * @param {String} recordToDelete The ID to delete.
     * @returns {Object} The ackowledgement of a deleted record.
     * @returns {Error} The record could not be found.
     */
    async deleteById(recordToDelete) {
        return this.model
            .findByIdAndDelete(recordToDelete)
            .orFail(() => new Error("Could not find record."));
    }

    /**
     * Delete all records in the database.
     *
     * @returns {Object} The ackowledgement of all deleted records.
     */
    async deleteAll() {
        return this.model.deleteMany();
    }
}

module.exports = MongooseService;
