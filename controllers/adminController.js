const User = require("../models/user");
const Car = require("../models/car");
const Product = require("../models/product");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");

const jwtKey = "wheels_pak";
const Video = require("../models/videos");
const multer = require("multer");

exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const payload = {
    email: email,
  };

  jwt.sign(payload, jwtKey, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      return res.status(500).json({ error: "Error creating token" });
    } else {
      res.status(200).json({ token: token });
    }
  });
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
    console.log("category sent");
    const categories = await Category.find();

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
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

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname +
//         "-" +
//         uniqueSuffix +
//         "." +
//         file.originalname.split(".").pop()
//     );
//   },
// });

// const upload = multer({ storage: storage });

// exports.AdProduct = async (req, res, next) => {
//   try {
//     const { title, category, price, quantity, description } = req.body;

//     if (!req.files) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const images = req.files.map((file) => file.path);

//     // Create a new product instance
//     const newProduct = new Product({
//       title,
//       category,
//       price,
//       quantity,
//       description,
//       images,
//     });

//     // Save the new product to the database
//     await newProduct.save();

//     res.status(200).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
exports.addProduct = async (req, res, next) => {
  try {
    upload.array("images[]", 5)(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      console.log("Images uploaded successfully");

      try {
        const { title, category, price, quantity, description } = req.body;

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded" });
        }

        const images = req.files.map((file) => file.path);

        // Find the category ObjectId by name
        const foundCategory = await Category.findOne({ name: category });

        if (!foundCategory) {
          return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = new Product({
          name: title,
          category: foundCategory._id, // Use the ObjectId of the found category
          price,
          quantity,
          description,
          images,
        });

        await newProduct.save();

        res.status(200).json({ message: "Product added successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Error handling image upload" });
  }
};

exports.editProduct = async (req, res, next) => {
  const productId = req.body.productId; // Get the product ID from the request body
  console.log(productId);
  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields with values from the request body
    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.description = req.body.description;

    // Save the updated product
    const updatedProduct = await product.save();

    console.log("product updated ");
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Edit product error: " + error);
    res
      .status(500)
      .json({ message: "Failed to edit product", error: error.toString() });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.body.productId;

  try {
    // Find the car document by carId and remove it from the database
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

// exports.AddVideo = async (req, res, next) => {
//   try {
//     const link = req.body.videoUrl;

//     const newVideo = new Video({
//       link: link,
//     });

//     await newVideo.save();

//     res.status(200).json({ message: "Video added successfully" });
//     console.log("Video uploaded successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
exports.AddVideo = async (req, res, next) => {
  try {
    const fullURL = req.body.videoUrl;
    const videoID = fullURL.split("v=")[1]; // Extract the video ID

    const newVideo = new Video({
      link: videoID, // Store the video ID instead of the full URL
    });

    await newVideo.save();

    res.status(200).json({ message: "Video added successfully" });
    console.log("Video uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.DeleteVideo = async (req, res, next) => {
  try {
    const videoId = req.body.videoId;
    console.log(videoId);

    const result = await Video.deleteOne({ _id: videoId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Video deleted successfully" });
      console.log("Video deleted successfully");
    } else {
      res.status(404).json({ message: "Video not found" });
      console.log("Video not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
