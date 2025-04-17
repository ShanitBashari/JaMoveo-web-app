const router = require("express").Router();
const {searchSongsHandler} = require("../controller/songController");

router.get("/songs", searchSongsHandler);


module.exports = router;