var express = require("express");
var router = express.Router();

// Get the Auth controller
var authController = require("../controllers/auth.controller");

// Log the user in
router.post("/login/", authController.login);

// Register the user
router.post("/register/", authController.register);

// Log the user out
router.post("/logout/", authController.logout);

module.exports = router;

/**
 * @swagger
 * /api/v1/register/:
 *   post:
 *     summary: register account
 *     tags: [Auth]
 *     requestBody:
 *       description: Example of register body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       200:
 *         description: Message stating the operation was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Username or email already in use
 */

/**
 * @swagger
 * /api/v1/login/:
 *   post:
 *     summary: login to the user's account
 *     tags: [Auth]
 *     requestBody:
 *       description: Example of login body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       200:
 *         description: User data returned and auth token is stored in session cookie.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: readonline_token=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 id:
 *                   type: ObjectId
 *                 rights:
 *                   type: array
 *                   items:
 *                     type: string
 *
 *       400:
 *         description: Email or password was invalid.
 */

/**
 * @swagger
 * /api/v1/logout/:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: logout of the user's account
 *     tags: [Auth]
 *     requestBody:
 *       description: Example of login body
 *       required: true
 *     responses:
 *       200:
 *         description: Message stating the operation was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorised.
 */
