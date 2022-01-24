var express = require("express");
var router = express.Router();
// Authenticate the request with the token.
const { checkJwtToken } = require("../auth/authJwt");
const { isAdmin } = require("../auth/authJwt");

// Get the User controller
var userController = require("../controllers/user.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the user management API." });
});

// Create a new user
router.post("/users/", checkJwtToken, userController.create);

// Retrieve all users
router.get("/users/", checkJwtToken, isAdmin, userController.findAll);

// Retrieve a single user with id
router.get("/users/:id", checkJwtToken, isAdmin, userController.findOne);

// Update a user with id
router.put("/users/:id", checkJwtToken, userController.update);

// Delete a user with id
router.delete("/users/:id", checkJwtToken, isAdmin, userController.delete);

// Delete all users of the database
router.delete("/users/", checkJwtToken, isAdmin, userController.deleteAll);

module.exports = router;
