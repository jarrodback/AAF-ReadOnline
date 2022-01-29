var express = require("express");
var router = express.Router();
// Authenticate the request with the token.
const { checkJwtToken } = require("../middleware/auth/authJwt");

// Get the User controller
var notificationController = require("../controllers/notification.controller");

// Create a new notification
router.post("/notifications/", checkJwtToken, notificationController.create);

// Retrieve all notifications
router.get("/notifications/", checkJwtToken, notificationController.findAll);

// Delete a notification with id
router.delete(
    "/notifications/:id",
    checkJwtToken,
    notificationController.delete
);

module.exports = router;

/**
 * @swagger
 * /api/v1/notifications/:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Message containing all the user's notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   username:
 *                     type: string
 *       404:
 *         description: No notifications found
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/notifications/:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create notification
 *     tags: [Notifications]
 *     requestBody:
 *       description: Example of notification create body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 message:
 *                   type: string
 *     responses:
 *       200:
 *         description: Message stating the notifcation was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Notification failed to be created.
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/notifications/:id/:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete notification
 *     tags: [Notifications]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of notification
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message stating the notifcation was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Notification failed to be deleted.
 *       403:
 *         description: User doesn't have permission to delete the notification.
 *       401:
 *         description: Unauthorised.
 */
