const User = require("../models/user");
const Car = require("../models/car");

exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.pass;

  res.status(200).json({ message: "success" });
};

exports.getEveryAd = async (req, res, next) => {
  try {
    const cars = await Car.find();
    const users = await User.find();

    res.status(200).json({ cars, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
