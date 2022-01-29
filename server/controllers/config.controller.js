const ConfigService = require("../services/configService.js");
const configService = new ConfigService();

/**
 * Find all Configs from the database
 * @param {Object} req The config being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    configService
        .findAllSettings()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Update a Request based on the id provided
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    configService
        .updateConfig(req.body)
        .then(() => {
            res.status(200).send({
                message: "Config was successfully updated.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};
