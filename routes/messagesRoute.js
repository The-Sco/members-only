const router = require("express").Router();
const controller = require("../conrollers/messagesConroller");

router.get("/", controller.messagesGet);
router.get("/single/:id", controller.singleMessageGet);
router.post("/single/:id/delete", controller.deleteMessagePost);
router.get("/me", controller.myMessagesGet);
router.get("/new", controller.newMessageGet);
router.post("/new", controller.newMessagePost);

module.exports = router;
