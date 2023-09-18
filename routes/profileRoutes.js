const express = require("express");

const router = express.Router();
router.use(express.json());

const profileController = require("../controllers/profileController");

router.post("/update", profileController.updateProfile);
module.exports = router;
