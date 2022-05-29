const router = require("express").Router();
const authController = require("../controllers/auth");
const { disableCache } = require("../middlewares/cache");

router.use(disableCache);

/**
 * @openapi
 * /auth/discord:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     summary: Authentication Code Grant callback endpoint.
 *     operationId: authController.getDiscordToken
 *     responses:
 *       200:
 *         description: Authentication success
 *       403:
 *         description: Unable to authenticate
 */
router.post(`/auth/discord`, authController.getDiscordToken);

module.exports = router;