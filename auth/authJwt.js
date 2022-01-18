const { next } = require("cli");
const jwt = require("jsonwebtoken");

// Check if token is valid
checkJwtToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            message: "Unauthorized: No token provided.",
        });
    }
    const token = req.headers.authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized: Invalid token.",
            });
        }
        req.userId = decoded.id;
        req.email = decoded.email;
        req.role = decoded.role;
        return next();
    });
};

isAdmin = (req, res, next) => {
    const role = req.role;

    if (role != "Admin") {
        return res.status(403).send({
            message:
                "Unauthorized: You not do have permission to view this page.",
        });
    }
    return next();
};

isEmployee = (req, res, next) => {
    const role = req.role;

    if (role != "Admin" || role != "Employee") {
        return res.status(403).send({
            message:
                "Unauthorized: You not do have permission to view this page.",
        });
    }
    return next();
};

module.exports = {
    checkJwtToken,
    isAdmin,
    isEmployee,
};
