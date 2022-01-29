const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const cookieSession = require("cookie-session");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

require("dotenv").config();

var app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true }));

app.use(
    cookieSession({
        name: "readonline-token",
        secret: process.env.TOKEN_SECRET,
        httpOnly: true,
        keys: [process.env.TOKEN_SECRET],
    })
);

/**
 * OpenAPI (Swagger) Setup
 */
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ReadBooks: Online API",
            version: "1.0.0",
            description:
                "Documentation for the ReadBooks Online API. Includes requests, users and notifications.",
            contact: {
                name: "Readbooks Online",
                url: "http://localhost:8080",
            },
        },

        servers: [
            {
                url: "http://localhost:3050",
                description: "API Documentation",
            },
        ],
    },
    apis: ["./Routes/*.js"],

    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "readbooksonline_token",
            },
        },
    },
};

const specs = swaggerJsDoc(options);

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(specs, { explorer: true })
);

/**
 * Router setup
 */
var requestRouter = require("./routes/request.routes");
var userRouter = require("./routes/user.routes");
var authRouter = require("./routes/auth.routes");
var notificationRouter = require("./routes/notification.routes");
var configRouter = require("./routes/config.routes");

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
app.use("/notify", notificationRouter);
app.use("/config", configRouter);

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
