const router = require("express").Router();
const controller = require("../conrollers/authenticationController");

router.get("/sign-up", controller.sinUpGet);

router.post("/sign-up", controller.signUpPost);

module.exports = router;
