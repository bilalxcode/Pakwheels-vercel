const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/sign-up", authController.SignUp);

module.exports = router;
