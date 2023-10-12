//imports
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

//router
router.use(express.json());

//routes
router.post("/login", adminController.adminLogin);

router.get("/getEveryAd", adminController.getEveryAd);
router.get("/getCategory", adminController.getCategory);
router.get("/getProducts", adminController.getProducts);
router.get("/getVideo", adminController.getVideo);
router.post("/getAllOrders", adminController.getAllOrders);
router.get("/getOrders", adminController.getOrders);

router.post("/BanUser", adminController.BanUser);
router.post("/UnBanUser", adminController.UnBanUser);

router.post("/approveAd", adminController.ApproveAd);
router.post("/approveBikeAd", adminController.ApproveBikeAd);

router.post("/deleteAd", adminController.DeleteAd);
router.post("/deleteBikeAd", adminController.DeleteBikeAd);
router.post("/deleteProduct", adminController.deleteProduct);
router.post("/DeleteVideo", adminController.DeleteVideo);

router.post("/DisApproveAd", adminController.DisApproveAd);
router.post("/DisApproveBikeAd", adminController.DisApproveBikeAd);

router.post("/addProduct", adminController.addProduct);
router.post("/AddNewCategory", adminController.AddNewCategory);
router.post("/adVideo", adminController.AddVideo);

router.post("/editProduct", adminController.editProduct);

router.post("/userCODOrder", adminController.userCODOrder);
router.post("/userStripeOrder", adminController.userStripeOrder);

router.post("/dispatchOrder", adminController.dispatchOrder);

router.post("/updateStripeOrder", adminController.updateStripeOrder);

module.exports = router;
