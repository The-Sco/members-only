import * as express from "express";
import * as controller from "../conrollers/joinController.js";

const router = express.Router();

router.get("/", controller.joinGet);
router.post("/", controller.joinPost);

export default router;
