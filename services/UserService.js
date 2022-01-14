const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("user");
const httpError = require("http-errors");
// Check if the ID given is a valid MongoDB ObjectID
const isIdValid = require("./utilities").isIdValid;

class UserService {
    /**
     * @description Create an instance of the UserService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    /**
     *  Create a user and save it to the User collection.
     *
     * @param {User} userToCreate
     * @returns {httpError} 200 If creating the User is successful.
     * @returns {httpError} 404 If creatiing the User is unsuccessful.
     */
    async createUser(userToCreate) {
        if (!validateUser(userToCreate)) {
            throw httpError(400, "User data is invalid.");
        }
        const user = {
            username: userToCreate.username,
            email: userToCreate.email,
            role: userToCreate.role,
        };
        return this.mongooseService.create(user).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     * Find all Users.
     *
     * @returns {Array} Returns array of Users that were found.
     */
    async findAllUsers() {
        return this.mongooseService.findAll();
    }

    /**
     *  Find a user.
     *
     * @param {String} userToFind
     * @returns {httpError} 200 If finding the User is successful.
     * @returns {httpError} 404 If no User is found.
     */
    async findUser(userToFind) {
        if (!isIdValid(userToFind)) {
            throw httpError(404, "User ID is invalid.");
        }
        return this.mongooseService.findById(userToFind).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Update a user.
     *
     * @param {String} userToUpdate
     * @param {Object} to_update
     * @returns {httpError} 200 If updating the User is successful.
     * @returns {httpError} 404 If user could not be updated.
     */
    async updateUser(userToUpdate, to_update) {
        if (!isIdValid(userToUpdate)) {
            throw httpError(404, "User ID is invalid.");
        }
        return this.mongooseService
            .update(userToUpdate, to_update)
            .then((data) => {
                console.log("Successfully updated? : ", data);
            })
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     *  Delete a user.
     *
     * @param {String} userToDelete
     * @returns {httpError} 200 If deleteing the User is successful.
     * @returns {httpError} 404 If user could not be deleted.
     */
    async deleteUser(userToDelete) {
        if (!isIdValid(userToDelete)) {
            throw httpError(404, "User ID is invalid.");
        }
        return this.mongooseService.deleteById(userToDelete).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Delete a user.
     *
     * @returns {httpError} 200 If deleteing the Users is successful.
     */
    async deleteAllUsers() {
        return this.mongooseService.deleteAll();
    }
}

/**
 *  Validates the data in a User.
 *
 * @returns {Boolean} True if the object maps correct to the User model.
 */
function validateUser(user) {
    if (!user || !user.username || !user.email || !user.role) {
        return false;
    } else {
        return true;
    }
}

module.exports = UserService;
