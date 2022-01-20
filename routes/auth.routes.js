var express = require("express");
var router = express.Router();

// Get the Auth controller
var authController = require("../controllers/auth.controller");

// Log the user in
router.post("/login/", authController.login);

// Register the user
router.post("/register/", authController.register);

router.post("/logout/", authController.logout);

module.exports = router;
