var express = require("express");
var router = express.Router();

//Require controller
var requestController = require("../controllers/request.controller");

router.get("/", function (req, res, next) {
    res.json({ message: "Welcome to the ReadOnline API." });
});

// Create a new request
router.post("/requests/", requestController.create);

// Retrieve all animals
router.get("/requests/", requestController.findAll);

// Retrieve a single request with id
router.get("/requests/:id", requestController.findOne);

// Update a request with id
router.put("/requests/:id", requestController.update);

// Delete a request with id
router.delete("/requests/:id", requestController.delete);

// Delete all requests of the database
router.delete("/requests/", requestController.deleteAll);

module.exports = router;
