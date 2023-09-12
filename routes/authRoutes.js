const express = require("express");

const router = express.Router();
router.use(express.json());

const authController = require("../controllers/authController");

router.post(
  "/sign-up",
  authController.isNewUser,
  authController.isPasswordValid,
  authController.SignUp
);
router.post("/sign-out", authController.SignOut);
router.post(
  "/logIn",
  authController.checkEmailAndPassword,
  authController.LogIn
);

module.exports = router;
