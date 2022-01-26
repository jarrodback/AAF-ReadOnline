const MongooseService = require("./MongooseService.js");
const model = require("../database").getModel("notification");
const httpError = require("http-errors");
// Check if the ID given is a valid MongoDB ObjectID
const isIdValid = require("../middleware/validation/utilities").isIdValid;

class NotificationService {
    /**
     * @description Create an instance of the NotificationService
     */

    constructor() {
        // Create an instance of the data layer.
        this.mongooseService = new MongooseService(model);
    }

    /**
     *  Create a notification and save it to the Notification collection.
     *
     * @param {Notification} notificationToCreate
     * @returns {httpError} 200 If creating the Notification is successful.
     * @returns {httpError} 404 If creatiing the Notification is unsuccessful.
     */
    async createNotification(notificationToCreate) {
        if (!validateNotification(notificationToCreate)) {
            throw httpError(400, "Notification data is invalid.");
        }

        const notification = {
            message: notificationToCreate.message,
            username: notificationToCreate.username,
        };
        return this.mongooseService.create(notification).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Find a Notification by params
     *
     * @param {String} params The params to search for
     * @returns {httpError} 200 If finding the Notification is successful.
     * @returns {httpError} 404 If no Notification is found.
     */
    async findNotificationByParams(params) {
        return this.mongooseService.findByProperty(params).catch((error) => {
            throw httpError(404, error.message);
        });
    }

    /**
     *  Delete a notification.
     *
     * @param {String} notificationToDelete
     * @returns {httpError} 200 If deleteing the Notification is successful.
     * @returns {httpError} 404 If notification could not be deleted.
     */
    async deleteNotification(notificationToDelete, requestedBy) {
        if (!isIdValid(notificationToDelete)) {
            throw httpError(404, "Notification ID is invalid.");
        }
        return this.mongooseService
            .findById(notificationToDelete)
            .then((notification) => {
                if (!validateNotificationPerm(requestedBy, notification)) {
                    throw httpError(
                        403,
                        "You do not have permission to delete this notification."
                    );
                }
                return this.mongooseService
                    .deleteById(notificationToDelete)
                    .catch((error) => {
                        throw httpError(404, error.message);
                    });
            });
    }
}

/**
 *  Validates the data in a Notification.
 *
 * @returns {Boolean} True if the object maps correct to the Notification model.
 */
function validateNotification(notification) {
    if (!notification || !notification.message || !notification.username) {
        return false;
    } else {
        return true;
    }
}
function validateNotificationPerm(requestedBy, notification) {
    if (
        requestedBy.role !== "Admin" &&
        requestedBy.username.toLowerCase() !==
            notification.username.toLowerCase()
    ) {
        return false;
    } else {
        return true;
    }
}
module.exports = NotificationService;
