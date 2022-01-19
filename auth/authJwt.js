const { next } = require("cli");
const jwt = require("jsonwebtoken");

// Check if token is valid
checkJwtToken = (req, res, next) => {
    // if (!req.headers.authorization) {
    if (!req.session || !req.session.token) {
        console.log("no session");
        return res.status(401).send({
            message: "Unauthorized: No token provided.",
        });
    }
    const token = req.session.token; //req.headers.authorization.replace("Bearer ", "");
    console.log("TOken? ", token);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
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
