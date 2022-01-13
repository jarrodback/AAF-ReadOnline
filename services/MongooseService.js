class MongooseService {
    /**
     * @description Create an instance of the MongooseService
     */

    constructor(model) {
        // Create an instance of the data layer.
        this.model = model;
    }
    async create(requestToCreate) {
        return this.model.create(requestToCreate);
    }
    async findAll() {
        return this.model.find({});
    }
    async findById(recordToFind) {
        return this.model
            .findById(recordToFind)
            .orFail(() => new Error("Could not find record."));
    }
    async update(recordToUpdate, to_update) {
        console.log(recordToUpdate, " : ", to_update);
        return this.model
            .updateOne(recordToUpdate, to_update)
            .orFail(() => new Error("Could not find record."));
    }
    async deleteById(recordToDelete) {
        return this.model
            .findByIdAndDelete(recordToDelete)
            .orFail(() => new Error("Could not find record."));
    }
    async deleteAll() {
        return this.model.deleteMany();
    }
}

module.exports = MongooseService;
