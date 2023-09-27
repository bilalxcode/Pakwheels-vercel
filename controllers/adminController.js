const User = require("../models/user");
const Car = require("../models/car");
const Product = require("../models/product");
const Category = require("../models/category");
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
exports.BanUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Find the user by their ID and update the isBanned property to true
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    );

    if (!updatedUser) {
      // If the user with the given ID is not found, return an error
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with a success message
    res
      .status(200)
      .json({ message: "User banned successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to ban user" });
  }
};

exports.UnBanUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Find the user by their ID and update the isBanned property to true
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    );

    if (!updatedUser) {
      // If the user with the given ID is not found, return an error
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with a success message
    res
      .status(200)
      .json({ message: "User Unbanned successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unban user" });
  }
};

exports.ApproveAd = async (req, res, next) => {
  try {
    const carId = req.body.carId;

    // Find the car by ID and update the isApproved property to true
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res
      .status(200)
      .json({ message: "Car approved successfully", car: updatedCar });
  } catch (error) {
    console.error("Error approving car:", error);
    res.status(500).json({ message: "Error approving car" });
  }
};

exports.DisApproveAd = async (req, res, next) => {
  try {
    const carId = req.body.carId;

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { isApproved: false },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res
      .status(200)
      .json({ message: "Car Disapproved successfully", car: updatedCar });
  } catch (error) {
    console.error("Error Disapproving car:", error);
    res.status(500).json({ message: "Error Disapproving car" });
  }
};

exports.DeleteAd = async (req, res, next) => {
  const carId = req.body.carId;

  try {
    // Find the car document by carId and remove it from the database
    const deletedCar = await Car.findByIdAndRemove(carId);

    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({ message: "Failed to delete car" });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.AddNewCategory = async (req, res, next) => {
  try {
    const newCategoryName = req.body.newCategoryName;

    console.log("Received new category name:", newCategoryName);

    // Create a new category instance
    const newCategory = new Category({ name: newCategoryName });

    // Save the new category to the database
    await newCategory.save();
    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

exports.AdProduct = async (req, res, next) => {
  try {
    const { title, category, price, quantity, description, images } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      title,
      category,
      price,
      quantity,
      description,
      images,
    });

    // Save the new product to the database
    await newProduct.save();

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
