const express = require("express");

const router = express.Router();
router.use(express.json());
const adController = require("../controllers/adController");

router.post("/post-car-ad", adController.postCarAd);
router.post("/car-images", adController.addCarImage);
router.post("/seller-contact", adController.addCarContact);
router.post("/getAllAds", adController.getAllAds);

router.post("/post-bike-ad", adController.postBikeAd);
router.post("/bike-images", adController.addBikeImage);
router.post("/seller-contact-bike", adController.addBikeContact);

module.exports = router;
