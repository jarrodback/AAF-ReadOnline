const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");

var app = express();

app.use(cors());

/**
 * Router setup
 */
var requestRouter = require("./routes/request.routes");
var userRouter = require("./routes/user.routes");

/**
 * View Engine setup
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuring the main routes
app.use("/readonline", requestRouter);
app.use("/usermanagement", userRouter);

/**
 * Parsing handling
 */
// Parse requests of content-type - application/json and application/x-www-form-urlencoded

/**
 * Error handling
 */
// Catch a 404 error
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // Only show errors in development build
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
