var express = require("express");
var router = express.Router();

// Get the Request controller
var requestController = require("../controllers/request.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the ReadOnline API." });
});

// Create a new Request
router.post("/requests/", requestController.create);

// Retrieve all Requests
router.get("/requests/", requestController.findAll);

// Retrieve a single Request with id
router.get("/requests/:id", requestController.findOne);

// Update a Request with id
router.put("/requests/:id", requestController.update);

// Delete a Request with id
router.delete("/requests/:id", requestController.delete);

// Delete all Requests of the database
router.delete("/requests/", requestController.deleteAll);

module.exports = router;
