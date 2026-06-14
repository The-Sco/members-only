const router = require("express").Router();
const controller = require("../conrollers/authConroller");

router.get("/sign-up", controller.sinUpGet);
router.post("/sign-up", controller.signUpPost);

router.get("/log-in", controller.logInGet);
router.post("/log-in", controller.logInPost);

router.get("/log-out", controller.logOutGet);

module.exports = router;
