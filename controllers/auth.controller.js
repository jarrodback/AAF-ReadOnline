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
        .then((token) => {
            req.session.token = token;
            console.log("My cookie: ", token);
            res.status(200).send({
                message: "Successfully logged in.",
                // token: token,
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
