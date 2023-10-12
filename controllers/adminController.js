//imports
const User = require("../models/user");
const Car = require("../models/car");
const Bike = require("../models/bike");
const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");
const Video = require("../models/videos");
const multer = require("multer");

//keys
const jwtKey = "wheels_pak";
const STRIPE_SECRET_KEY =
  "sk_test_51Nk18qCVtk9qc81A5lKBuslEdlf1hquSfQmmFAQBhpJOMhF0b6Ahm87touepu5iOCDuKlKvwxWDEEuxT3ra5ceYv00egr52yl4";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

//controllers
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
    const bikes = await Bike.find();

    res.status(200).json({ cars, users, bikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.BanUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

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

exports.ApproveBikeAd = async (req, res, next) => {
  try {
    const bikeId = req.body.bikeId;

    const updatedBike = await Bike.findByIdAndUpdate(
      bikeId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res
      .status(200)
      .json({ message: "Bike approved successfully", bike: updatedBike });
  } catch (error) {
    console.error("Error approving bike:", error);
    res.status(500).json({ message: "Error approving bike" });
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

exports.DisApproveBikeAd = async (req, res, next) => {
  try {
    const bikeId = req.body.bikeId;

    const updatedBike = await Bike.findByIdAndUpdate(
      bikeId,
      { isApproved: false },
      { new: true }
    );

    if (!updatedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res
      .status(200)
      .json({ message: "Bike Disapproved successfully", bike: updatedBike });
  } catch (error) {
    console.error("Error Disapproving Bike:", error);
    res.status(500).json({ message: "Error Disapproving Bike" });
  }
};

exports.DeleteAd = async (req, res, next) => {
  const carId = req.body.carId;

  try {
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

exports.DeleteBikeAd = async (req, res, next) => {
  const bikeId = req.body.bikeId;

  try {
    const deletedBike = await Bike.findByIdAndRemove(bikeId);

    if (!deletedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    return res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    console.error("Error deleting bike:", error);
    return res.status(500).json({ message: "Failed to delete bike" });
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
    const newCategory = new Category({ name: newCategoryName });

    await newCategory.save();
    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//multer
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

//controllers
exports.addProduct = async (req, res, next) => {
  try {
    upload.array("images[]", 5)(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      try {
        const { title, category, price, quantity, description } = req.body;

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded" });
        }

        const images = req.files.map((file) => file.path);

        const foundCategory = await Category.findOne({ name: category });

        if (!foundCategory) {
          return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = new Product({
          name: title,
          category: foundCategory._id,
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
  const productId = req.body.productId;
  console.log(productId);
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.description = req.body.description;

    const updatedProduct = await product.save();

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

exports.AddVideo = async (req, res, next) => {
  try {
    const fullURL = req.body.videoUrl;
    const videoID = fullURL.split("v=")[1];

    const newVideo = new Video({
      link: videoID,
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

exports.userCODOrder = async (req, res, next) => {
  try {
    const { user, products, address, phoneNumber } = req.body;

    const newOrder = new Order({
      user: user,
      address: address,
      phoneNumber: phoneNumber,
      products: products,
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ user: userId }).populate("products");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const products = await Product.find();
    res.status(200).json({ orders, products });
  } catch (error) {
    console.error("Error getting ads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.dispatchOrder = async (req, res, next) => {
  const orderId = req.body.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isDispatched: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order Dispatched", order: updatedOrder });
  } catch (error) {
    console.error("Error dispatching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userStripeOrder = async (req, res, next) => {
  const { amount, id, user, orders, phoneNumber, address } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Pakwheels Autostore Purchase",
      payment_method: id,
      confirm: true,
      payment_method_types: ["card"],
      return_url: "http://localhost:3000/checkout",
    });
    const newOrder = new Order({
      user,
      products: orders,
      phoneNumber,
      address,
      isPaid: true,
    });

    const savedOrder = await newOrder.save();

    res.json({
      message: "Payment successful",
      success: true,
      savedOrder: savedOrder,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
};

exports.updateStripeOrder = async (req, res, next) => {
  const order = req.body.order;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const orderId = order[0]._id;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        phoneNumber: phoneNumber,
        address: address,
        isPaid: true,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order Dispatched", order: updatedOrder });
    console.log(updatedOrder);
  } catch (error) {
    console.error("Error dispatching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
