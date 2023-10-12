//imports
const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

//router
router.use(express.json());

//routes
router.post(
  "/sign-up",
  authController.isNewUser,
  authController.isPasswordValid,
  authController.sendEmailVerification,
  authController.SignUp
);
router.post("/verify", authController.verifyEmail);

router.post(
  "/logIn",
  authController.checkEmailAndPassword,
  authController.LogIn
);
router.post("/saveGoogleUser", authController.saveGoogleUser);

router.post("/getUser", authController.getUser);

router.post("/resetPassword", authController.resetPassword);
router.post("/validateResetPassword", authController.validateResetPassword);
router.post("/finalResetPassword", authController.finalResetPassword);

router.post("/sign-out", authController.SignOut);

module.exports = router;
