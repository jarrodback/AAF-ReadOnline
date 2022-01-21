const NotificationService = require("../services/NotificationService.js");
const notificationService = new NotificationService();

/**
 * Create a new Notification and save to the database
 * @param {Object} req The notification being sent
 * @param {Object} res The response returned
 */
exports.create = (req, res) => {
    notificationService
        .createNotification(req.body)
        .then((data) => {
            console.log("Notification has been saved in the database: " + data);

            res.status(200).send({
                message: "Notification was successfully created.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Find all Notifications from the database
 * @param {Object} req The notification being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    const url = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
    );
    let params = new URLSearchParams(url.search);
    if (params) {
        params = Object.fromEntries(params);

        notificationService
            .findNotificationByParams(params)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "An error occurred while finding the Notification.",
                });
            });
    } else {
        res.status(404).send({
            message: err.message || "Unable to find notifications.",
        });
    }
};

/**
 * Delete a Notification based on the id provided
 * @param {Object} req The notification being sent
 * @param {Object} res The response returned
 */
exports.delete = (req, res) => {
    notificationService
        .deleteNotification(req.params.id)
        .then(() => {
            res.status(200).send({
                message: "Notification was successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};
