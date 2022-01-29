var express = require("express");
var router = express.Router();
// Authenticate the user with the token.
const { checkJwtToken } = require("../middleware/auth/authJwt");
const { isAdmin } = require("../middleware/auth/authJwt");

// Get the User controller
var userController = require("../controllers/user.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the user management API." });
});

// Create a new user
router.post("/users/", checkJwtToken, isAdmin, userController.create);

// Retrieve all users
router.get("/users/", checkJwtToken, isAdmin, userController.findAll);

// Retrieve a single user with id
router.get("/users/:id", checkJwtToken, isAdmin, userController.findOne);

// Update a user with id
router.put("/users/:id", checkJwtToken, userController.update);

// Delete a user with id
router.delete("/users/:id", checkJwtToken, isAdmin, userController.delete);

// Delete all users of the database
router.delete("/users/", checkJwtToken, isAdmin, userController.deleteAll);

module.exports = router;

/**
 * @swagger
 * /usermanagement/users/:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Message containing all the users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                   rights:
 *                     type: object
 *                     properties:
 *                       permissions:
 *                         type: string
 *       404:
 *         description: No users found
 */

/**
 * @swagger
 * /usermanagement/users/:id/:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get user
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of user
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message containing all the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                 rights:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: string
 *       404:
 *         description: User wasn't found
 */

/**
 * @swagger
 * /usermanagement/users/:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create user
 *     tags: [Users]
 *     userBody:
 *       description: Example of user create body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 author:
 *                   type: string
 *                 cost:
 *                   type: integer
 *                 useredBy:
 *                   type: ObjectId
 *     responses:
 *       200:
 *         description: Message stating the user was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: User failed to be created.
 */

/**
 * @swagger
 * /usermanagement/users/:
 *   put:
 *     security:
 *       - cookieAuth: []
 *     summary: Update user
 *     tags: [Users]
 *     userBody:
 *       description: Example of user update body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 author:
 *                   type: string
 *                 cost:
 *                   type: integer
 *                 useredBy:
 *                   type: ObjectId
 *     responses:
 *       200:
 *         description: Message stating the user was updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: User failed to be updated.
 */

/**
 * @swagger
 * /usermanagement/users/:id/:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of user
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message stating the user was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User failed to be deleted.
 *       403:
 *         description: User doesn't have permission to delete the user.
 */

/**
 * @swagger
 * /usermanagement/users/:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Message stating the users were deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Users failed to be deleted.
 *       403:
 *         description: User doesn't have permission to delete the users.
 */
