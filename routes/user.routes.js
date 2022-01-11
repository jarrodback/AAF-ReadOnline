var express = require("express");
var router = express.Router();

// Get the User controller
var userController = require("../controllers/user.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the user management API." });
});

// Create a new user
router.post("/users/", userController.create);

// Retrieve all users
router.get("/users/", userController.findAll);

// Retrieve a single user with id
router.get("/users/:id", userController.findOne);

// Update a user with id
router.put("/users/:id", userController.update);

// Delete a user with id
router.delete("/users/:id", userController.delete);

// Delete all users of the database
router.delete("/users/", userController.deleteAll);

module.exports = router;
