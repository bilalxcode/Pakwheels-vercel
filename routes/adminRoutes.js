const express = require("express");

const router = express.Router();
router.use(express.json());
const adminController = require("../controllers/adminController");
router.post("/login", adminController.adminLogin);
router.get("/getEveryAd", adminController.getEveryAd);
router.post("/BanUser", adminController.BanUser);
router.post("/UnBanUser", adminController.UnBanUser);
router.post("/approveAd", adminController.ApproveAd);
router.post("/approveBikeAd", adminController.ApproveBikeAd);

router.post("/deleteAd", adminController.DeleteAd);
router.post("/deleteBikeAd", adminController.DeleteBikeAd);

router.post("/DisApproveAd", adminController.DisApproveAd);
router.post("/DisApproveBikeAd", adminController.DisApproveBikeAd);

router.post("/addProduct", adminController.addProduct);
router.get("/getCategory", adminController.getCategory);
router.post("/AddNewCategory", adminController.AddNewCategory);
router.get("/getProducts", adminController.getProducts);
router.post("/editProduct", adminController.editProduct);
router.post("/deleteProduct", adminController.deleteProduct);
router.post("/adVideo", adminController.AddVideo);
router.get("/getVideo", adminController.getVideo);
router.post("/DeleteVideo", adminController.DeleteVideo);
router.post("/userCODOrder", adminController.userCODOrder);
router.post("/getAllOrders", adminController.getAllOrders);
router.get("/getOrders", adminController.getOrders);
router.post("/dispatchOrder", adminController.dispatchOrder);
router.post("/userStripeOrder", adminController.userStripeOrder);
router.post("/updateStripeOrder", adminController.updateStripeOrder);


module.exports = router;
