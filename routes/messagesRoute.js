import * as express from "express";
import * as controller from "../conrollers/messagesConroller.js";

const router = express.Router();

router.get("/", controller.messagesGet);
router.get("/single/:id", controller.singleMessageGet);
router.post("/single/:id/delete", controller.deleteMessagePost);
router.get("/me", controller.myMessagesGet);
router.get("/new", controller.newMessageGet);
router.post("/new", controller.newMessagePost);

export default router;
