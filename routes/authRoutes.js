const express = require("express");

const router = express.Router();
router.use(express.json());

const authController = require("../controllers/authController");

router.post(
  "/sign-up",
  authController.isNewUser,
  authController.isPasswordValid,
  authController.sendEmailVerification,
  authController.SignUp
);
router.post("/sign-out", authController.SignOut);
router.post(
  "/logIn",
  authController.checkEmailAndPassword,
  authController.LogIn
);
router.get("/verify/:token", authController.verifyEmail);
module.exports = router;
