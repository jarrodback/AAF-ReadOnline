const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const cookieSession = require("cookie-session");

require("dotenv").config();

var app = express();

app.use(cors());

app.use(
    cookieSession({
        name: "readonline-token",
        secret: process.env.TOKEN_SECRET,
        httpOnly: true,
    })
);

/**
 * Router setup
 */
var requestRouter = require("./routes/request.routes");
var userRouter = require("./routes/user.routes");
var authRouter = require("./routes/auth.routes");

/**
 * View Engine setup
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuring the main routes
app.use("/readonline", requestRouter);
app.use("/usermanagement", userRouter);
app.use("/auth", authRouter);

app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
    // );
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    // );
    // next();
});

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
