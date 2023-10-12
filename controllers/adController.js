//imports
const User = require("../models/user");
const Car = require("../models/car");
const Bike = require("../models/bike");
const multer = require("multer");

//Controllers
exports.postCarAd = (req, res, next) => {
  const formData = req.body.formData;
  const selectedFeatures = req.body.selectedFeatures;
  const userId = req.body.userId;
  const newCar = new Car({
    city: formData.city,
    modelYear: formData.modelYear,
    modelName: formData.modelName,
    registeredIn: formData.registeredIn,
    color: formData.color,
    mileage: formData.mileage,
    price: formData.price,
    description: formData.description,
    engineType: formData.engineType,
    transmission: formData.transmission,
    engineCapacity: formData.engineCapacity,
    assembly: formData.assembly,
    features: selectedFeatures,
    seller: userId,
  });

  newCar
    .save()
    .then((car) => {
      console.log("New Car added successfully without approval ");
      return res.status(200).json({
        message: "New Car added successfully without approval",
        car: car,
      });
    })
    .catch((error) => {
      console.error("Error adding new car:", error);
      res.json({ error: "Error adding new car" }); // Send a JSON response
    });
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

// controllers

exports.addCarImage = async (req, res, next) => {
  try {
    upload.array("images[]", 5)(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      // Extract car data from the formData
      const car = JSON.parse(req.body.car);
      const carId = car._id; // Assuming the car object has an _id field

      // Get an array of image URLs or references from req.files
      const imageUrls = req.files.map((file) => file.path);

      // Update the car document with the new image URLs
      try {
        const updatedCar = await Car.findByIdAndUpdate(
          carId,
          { $push: { images: imageUrls } },
          { new: true }
        );

        if (!updatedCar) {
          return res.status(404).json({ error: "Car not found" });
        }

        return res.status(200).json({ message: "Image Uploaded Successfully" });
      } catch (updateError) {
        console.error("Error updating car:", updateError);
        return res.status(500).json({ error: "Error updating car" });
      }
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Error handling image upload" });
  }
};

exports.addCarContact = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const car = req.body.car;
    const carId = car._id;

    const carToUpdate = await Car.findById(carId);

    if (!carToUpdate) {
      return res.status(404).json({ message: "Car not found" });
    }

    carToUpdate.sellerContact = phoneNumber;

    await carToUpdate.save();

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postBikeAd = (req, res, next) => {
  const formData = req.body.formData;
  const selectedFeatures = req.body.selectedFeatures;
  const userId = req.body.userId;
  const newBike = new Bike({
    city: formData.city,
    modelName: formData.modelName,
    registeredIn: formData.registeredIn,
    color: formData.color,
    mileage: formData.mileage,
    price: formData.price,
    description: formData.description,
    engineType: formData.engineType,
    engineCapacity: formData.engineCapacity,
    modelYear: formData.modelYear,
    features: selectedFeatures,
    seller: userId,
  });

  newBike
    .save()
    .then((bike) => {
      return res.status(200).json({
        message: "New Bike added successfully without approval",
        bike: bike,
      });
    })
    .catch((error) => {
      console.error("Error adding new bike:", error);
      res.json({ error: "Error adding new bike" });
    });
};

exports.addBikeImage = async (req, res, next) => {
  try {
    upload.array("images[]", 5)(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      const bike = JSON.parse(req.body.bike);
      const bikeId = bike._id;

      const imageUrls = req.files.map((file) => file.path);

      try {
        const updatedBike = await Bike.findByIdAndUpdate(
          bikeId,
          { $push: { images: imageUrls } },
          { new: true }
        );

        if (!updatedBike) {
          console.log("Image not added to the bike");
          return res.status(404).json({ error: "bike not found" });
        }

        return res.status(200).json({ message: "Image Uploaded Successfully" });
      } catch (updateError) {
        console.error("Error updating bike:", updateError);
        return res.status(500).json({ error: "Error updating bike" });
      }
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Error handling image upload" });
  }
};

exports.addBikeContact = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const bike = req.body.bike;
    const bikeId = bike._id;

    const bikeToUpdate = await Bike.findById(bikeId);

    if (!bikeToUpdate) {
      return res.status(404).json({ message: "Bike not found" });
    }

    bikeToUpdate.sellerContact = phoneNumber;

    await bikeToUpdate.save();

    res.status(200).json({ message: "Bike Contact updated successfully" });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAds = async (req, res, next) => {
  try {
    const user = req.body.user;
    const userId = user._id;
    const userFound = await User.findById(userId);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    const ads = await Car.find({ seller: userId });
    const bikeAds = await Bike.find({ seller: userId });

    res.status(200).json({ message: "success", ads, bikeAds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEveryAd = (res, req, next) => {};
