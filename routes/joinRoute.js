const router = require("express").Router();
const controller = require("../conrollers/joinController");

router.get("/", controller.joinGet);
router.post("/", controller.joinPost);

module.exports = router;
