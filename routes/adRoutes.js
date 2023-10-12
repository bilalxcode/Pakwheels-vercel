//imports
const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");

//router
router.use(express.json());

//routes
router.post("/post-car-ad", adController.postCarAd);
router.post("/post-bike-ad", adController.postBikeAd);

router.post("/car-images", adController.addCarImage);
router.post("/bike-images", adController.addBikeImage);

router.post("/seller-contact", adController.addCarContact);
router.post("/seller-contact-bike", adController.addBikeContact);

router.post("/getAllAds", adController.getAllAds);

module.exports = router;
