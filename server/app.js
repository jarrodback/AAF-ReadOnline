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
        //secure: true - Disabled as don't use HTTPS over local host so the cookie won't set.
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
app.use("/api/v1", requestRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", configRouter);

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

// Setup Socket.io event handling
const io = require("socket.io")({
    cors: {
        origins: ["http://localhost:8080"],
    },
});

io.sockets.on("connection", (socket) => {
    // The room id.
    let requestId = "";

    /**
     * On chat join, set the room code to be the request id and join that socket.
     */
    socket.on("chat_join", function (data) {
        requestId = data.requestId;
        socket.join(requestId);
        socket.broadcast.emit("chat_join", data);
    });

    /**
     * On chat message, broadcast to other clients on the room the message.
     */
    socket.on("chat_message", function (data) {
        socket.to(requestId).emit("chat_message", data);
    });

    /**
     * On typing, broadcast to other clients on the socket in that room the message.
     */
    socket.on("typing", function (data) {
        socket.to(requestId).emit("typing", data);
    });

    /**
     * On stop typing, broadcast to other clients on the socket in that room the message.
     */
    socket.on("stopTyping", function (data) {
        socket.to(requestId).emit("stopTyping", data);
    });

    /**
     * On chat leave, broadcast to other clients on the socket in that room the message.
     */
    socket.on("chat_leave", function (data) {
        socket.broadcast.emit("chat_leave", data);
    });

    socket.on("disconnect", () => {});
});

module.exports = { app, io };
