const express = require("express");

const router = express.Router();
router.use(express.json());
const adController = require("../controllers/adController");

router.post("/post-car-ad", adController.postCarAd);
router.post("/car-images", adController.addCarImage);
router.post("/seller-contact", adController.addCarContact);
router.post("/getAllAds", adController.getAllAds);

module.exports = router;
