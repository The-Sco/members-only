import * as express from "express";
import * as controller from "../conrollers/authConroller.js";

const router = express.Router();

router.get("/sign-up", controller.sinUpGet);
router.post("/sign-up", controller.signUpPost);

router.get("/log-in", controller.logInGet);
router.post("/log-in", controller.logInPost);

router.get("/log-out", controller.logOutGet);

export default router;
