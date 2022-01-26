const UserService = require("../services/UserService.js");
const userService = new UserService();

/**
 * Login the user
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.login = async (req, res) => {
    userService
        .login(req.body.email, req.body.password)
        .then((data) => {
            req.session.token = data.token;
            req.session.username = data.username;
            req.session.role = data.role;
            req.session.id = data.id;
            res.status(200).send({
                message: "Successfully logged in.",
                username: data.username,
                role: data.role,
                id: data.id,
            });
        })
        .catch((error) => {
            res.status(error.status).send({ message: error.message });
        });
};

/**
 * Register the user
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.register = (req, res) => {
    userService
        .register(req.body)
        .then(() => {
            res.status(200).send({
                message: "User was successfully created.",
            });
        })
        .catch((error) => {
            res.status(error.status).send({ message: error.message });
        });
};

/**
 * Logs the user out
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.logout = (req, res) => {
    req.session = null;
    res.status(200).send({
        message: "User was successfully logged out.",
    });
};
