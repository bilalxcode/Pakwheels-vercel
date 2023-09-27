const express = require("express");

const router = express.Router();
router.use(express.json());
const adminController = require("../controllers/adminController");
router.post("/login", adminController.adminLogin);
router.get("/getEveryAd", adminController.getEveryAd);

module.exports = router;
