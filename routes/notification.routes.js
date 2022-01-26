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
