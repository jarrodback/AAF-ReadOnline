var express = require("express");
var router = express.Router();

// Authenticate the request with the token.
const { checkJwtToken, isAdmin } = require("../middleware/auth/authJwt");

// Get the Request controller
var requestController = require("../controllers/request.controller");

// Display generic message when navigating to main route
router.get("/", function (req, res) {
    res.json({ message: "Welcome to the ReadOnline API." });
});

// Create a new Request
router.post("/requests/", checkJwtToken, requestController.create);

// Retrieve all Requests
router.get("/requests/", checkJwtToken, requestController.findAll);

// Retrieve a single Request with id
router.get("/requests/:id", checkJwtToken, requestController.findRequest);

// Update a Request with id
router.put("/requests/:id", checkJwtToken, requestController.update);

// Delete a Request with id
router.delete("/requests/:id", checkJwtToken, requestController.delete);

// Delete all Requests of the database
router.delete(
    "/requests/",
    checkJwtToken,
    isAdmin,
    requestController.deleteAll
);

module.exports = router;

/**
 * @swagger
 * /api/v1/requests/:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: Message containing all the user's requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   author:
 *                     type: string
 *                   cost:
 *                     type: integer
 *                   requestedBy:
 *                     type: ObjectId
 *                   status:
 *                     type: string
 *                   reviewingUser:
 *                     type: string
 *                   previousReviewer:
 *                     type: string
 *                   history:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       user:
 *                         type: string
 *       404:
 *         description: No requests found
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/requests/:id/:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get request
 *     tags: [Requests]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of request
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message containing all the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 author:
 *                   type: string
 *                 cost:
 *                   type: integer
 *                 requestedBy:
 *                   type: ObjectId
 *                 status:
 *                   type: string
 *                 reviewingUser:
 *                   type: string
 *                 previousReviewer:
 *                   type: string
 *                 history:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     user:
 *                       type: string
 *       404:
 *         description: Request wasn't found
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/requests/:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create request
 *     tags: [Requests]
 *     requestBody:
 *       description: Example of request create body
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
 *                 requestedBy:
 *                   type: ObjectId
 *     responses:
 *       200:
 *         description: Message stating the request was created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Request failed to be created.
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/requests/:
 *   put:
 *     security:
 *       - cookieAuth: []
 *     summary: Update request
 *     tags: [Requests]
 *     requestBody:
 *       description: Example of request update body
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
 *                 requestedBy:
 *                   type: ObjectId
 *     responses:
 *       200:
 *         description: Message stating the request was updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Request failed to be updated.
 *       401:
 *         description: Unauthorised.
 *       403:
 *         description: Forbidden, no permission.
 */

/**
 * @swagger
 * /api/v1/requests/:id/:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete request
 *     tags: [Requests]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of request
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Message stating the request was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Request failed to be deleted.
 *       403:
 *         description: User doesn't have permission to delete the request.
 *       401:
 *         description: Unauthorised.
 */

/**
 * @swagger
 * /api/v1/requests/:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: Message stating the requests were deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Requests failed to be deleted.
 *       403:
 *         description: User doesn't have permission to delete the requests.
 *       401:
 *         description: Unauthorised.
 */
