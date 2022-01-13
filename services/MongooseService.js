class MongooseService {
    /**
     * @description Create an instance of the MongooseService
     */

    constructor(model) {
        // Create an instance of the data layer.
        this.model = model;
    }
    async create(requestToCreate) {
        return await this.model.create(requestToCreate);
    }
    async findAll() {
        return this.model.find({});
    }
    async findOne(recordToFind) {
        return this.model
            .find({ recordToFind })
            .orFail(() => new Error("Could not find record."));
    }
    async update(recordToUpdate, to_update) {
        return await this.model.updateOne(recordToUpdate, to_update);
        // .orFail(() => new Error("Could not update record."));
    }
    async delete(recordToDelete) {
        return await this.model.deleteOne(recordToDelete);
    }
    async deleteAll() {
        return await this.model.deleteMany();
    }
}

module.exports = MongooseService;
