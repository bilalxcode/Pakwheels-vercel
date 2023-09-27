const express = require("express");

const router = express.Router();
router.use(express.json());
const adminController = require("../controllers/adminController");
router.post("/login", adminController.adminLogin);
router.get("/getEveryAd", adminController.getEveryAd);
router.post("/BanUser", adminController.BanUser);
router.post("/UnBanUser", adminController.UnBanUser);
router.post("/approveAd", adminController.ApproveAd);
router.post("/deleteAd", adminController.DeleteAd);
router.post("/DisApproveAd", adminController.DisApproveAd);
router.post("/addProduct", adminController.AdProduct);
router.get("/getCategory", adminController.getCategory);
router.post("/AddNewCategory", adminController.AddNewCategory);

module.exports = router;
