const router = require("express").Router();
const {registerHandler, loginHandler, sessionHandler} = require("../controller/userController");

router.post("/registerAdmin", registerHandler);
router.post("/registerPlayer", registerHandler);
router.post("/login", loginHandler);
router.get("/session", sessionHandler);

module.exports = router;