const express = require("express");

const router = express.Router();
router.use(express.json());
const adController = require("../controllers/adController");

router.post("/post-car-ad", adController.postCarAd);
router.post("/car-images", adController.addCarImage);

module.exports = router;
