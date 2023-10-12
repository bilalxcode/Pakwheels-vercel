//imports
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

//router
router.use(express.json());

//routes
router.post("/update", profileController.updateProfile);

module.exports = router;
