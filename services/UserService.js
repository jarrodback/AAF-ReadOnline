const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("user");
const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
            password: userToCreate.password,
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
     *  Find a user by email
     *
     * @param {String} email
     * @returns {httpError} 200 If finding the User is successful.
     * @returns {httpError} 404 If no User is found.
     */
    async findUserByEmail(email) {
        return this.mongooseService
            .findByProperty({ email: email })
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     *  Find a user by property
     *
     * @param {String} property The property to filter for.
     * @param {String} value The value to search against.
     * @returns {httpError} 200 If finding the User is successful.
     * @returns {httpError} 404 If no User is found.
     */
    async findUserByProperty(property, value) {
        return this.mongooseService
            .findByProperty({ [property]: value })
            .catch((error) => {
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
            .then((data) => {})
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

    /**
     *  Login a user.
     *
     * @param {String} email The user's email
     * @param {String} password The user's password
     * @returns {httpError} 200 If login is successful.
     * @returns {httpError} 401 If login is unsuccessful.
     */
    async login(email, password) {
        return this.findUserByEmail(email)
            .then((users) => {
                //Can only be 1 user returned as email is unique.
                const user = users[0];

                const passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                // Invalid password, return 401
                if (!passwordIsValid) {
                    throw httpError(
                        401,
                        "Your email or password is incorrect."
                    );
                }
                // Create token and store in the session cookie
                const token = jwt.sign(
                    { id: user._id, role: user.role, email: user.email },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: 3600, // 24 hours
                    }
                );

                return token;
            })
            .catch(() => {
                throw httpError(400, "Your email or password is incorrect.");
            });
    }

    /**
     *  Register a user.
     *
     * @param {String} email The user's email
     * @param {String} password The user's password
     * @returns {httpError} 200 If login is successful.
     * @returns {httpError} 401 If login is unsuccessful.
     */
    async register(user) {
        // if (!this.checkDuplicateEmail(user.email)) {
        //     throw httpError(400, "Email is already in use.");
        // }
        // if (!this.checkDuplicateUsername(user.username)) {
        //     throw httpError(400, "Username is already in use.");
        // }

        return this.createUser({
            username: user.username,
            email: user.email,
            password: bcrypt.hashSync(user.password, 8),
            role: "User",
        }).catch((error) => {
            throw httpError(400, error.message);
        });
    }

    /**
     *  Check if a email is already in use.
     *
     * @param {String} email The user's email
     * @returns {Boolean} True if email is already in use.
     */
    async checkDuplicateEmail(email) {
        return this.findUserByEmail(email);
    }

    /**
     *  Check if a username is already in use.
     *
     * @param {String} email The user's username
     * @returns {Boolean} True if username is already in use.
     */
    async checkDuplicateUsername(username) {
        this.findUserByProperty("username", username)
            .then(() => {
                return false;
            })
            .catch(() => {
                return true;
            });
    }
}

/**
 *  Validates the data in a User.
 *
 * @returns {Boolean} True if the object maps correct to the User model.
 */
function validateUser(user) {
    if (
        !user ||
        !user.username ||
        !user.email ||
        !user.role ||
        !user.password
    ) {
        return false;
    } else {
        return true;
    }
}

module.exports = UserService;
