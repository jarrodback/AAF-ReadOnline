var express = require("express");
var router = express.Router();
// Authenticate the request with the token.
const {
    checkJwtToken,
    isAdmin,
    isEmployee,
} = require("../middleware/auth/authJwt");

// Get the User controller
var configController = require("../controllers/config.controller");

// Update a config setting
router.put("/config/", checkJwtToken, isAdmin, configController.update);

// Retrieve all config settings
router.get("/config/", checkJwtToken, isEmployee, configController.findAll);

module.exports = router;

/**
 * @swagger
 * /api/v1/config:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get config details
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Config data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 costThreshold:
 *                   type: integer
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/config/:
 *   put:
 *     security:
 *       - cookieAuth: []
 *     summary: Update config details
 *     tags: [Config]
 *     requestBody:
 *       description: Example of config update body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 costThreshold:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Stating the request was a success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage:
 *                   type: string
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */
