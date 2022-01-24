var express = require("express");
var router = express.Router();
// Authenticate the request with the token.
const { checkJwtToken, isAdmin, isEmployee } = require("../auth/authJwt");

// Get the User controller
var configController = require("../controllers/config.controller");

// Update a config setting
router.put("/", checkJwtToken, isAdmin, configController.update);

// Retrieve all config settings
router.get("/", checkJwtToken, isEmployee, configController.findAll);

module.exports = router;
