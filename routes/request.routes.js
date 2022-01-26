var express = require("express");
var router = express.Router();

// Authenticate the request with the token.
const { checkJwtToken, isAdmin } = require("../middleware/auth/authJwt");

// Get the Request controller
var requestController = require("../controllers/request.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the ReadOnline API." });
});

// Create a new Request
router.post("/requests/", checkJwtToken, requestController.create);

// Retrieve all Requests
router.get("/requests/", checkJwtToken, requestController.findAll);

// Retrieve a single Request with id
router.get("/requests/:id", checkJwtToken, requestController.findRequest);

// Update a Request with id
router.put("/requests/:id", checkJwtToken, requestController.update);

// Delete a Request with id
router.delete("/requests/:id", checkJwtToken, requestController.delete);

// Delete all Requests of the database
router.delete(
    "/requests/",
    checkJwtToken,
    isAdmin,
    requestController.deleteAll
);

module.exports = router;
