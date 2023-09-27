const User = require("../models/user");
const Car = require("../models/car");
const multer = require("multer");


exports.postCarAd = (req, res, next) => {
  const formData = req.body.formData;
  const selectedFeatures = req.body.selectedFeatures;
  console.log(formData, selectedFeatures);
  const userId = req.body.userId;
  console.log(userId);
  const newCar = new Car({
    city: formData.city,
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
exports.addCarImage = async (req, res, next) => {
  try {
    upload.array("images[]", 5)(req, res, async (err) => {
      if (err) {
        console.error("Error uploading images:", err);
        return res.status(500).json({ error: "Error uploading images" });
      }

      console.log("Images uploaded successfully");

      // Extract car data from the formData
      const car = JSON.parse(req.body.car);
      const carId = car._id; // Assuming the car object has an _id field
      console.log("Car ID:", carId);

      // Get an array of image URLs or references from req.files
      const imageUrls = req.files.map((file) => file.path);
      console.log("Image URLs:", imageUrls);

      // Update the car document with the new image URLs
      try {
        const updatedCar = await Car.findByIdAndUpdate(
          carId,
          { $push: { images: imageUrls } },
          { new: true }
        );

        if (!updatedCar) {
          console.log("Image not added to the car");
          return res.status(404).json({ error: "Car not found" });
        }

        console.log("Updated Car:", updatedCar);
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

    console.log("phone:", phoneNumber);
    console.log("carId:", carId);

    // Find the car by its ID
    const carToUpdate = await Car.findById(carId);

    if (!carToUpdate) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update the sellerContact field
    carToUpdate.sellerContact = phoneNumber;

    // Save the updated car object
    await carToUpdate.save();

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAds = async (req, res, next) => {
  try {
    const user = req.body.user;
    const userId = user._id; // Assuming you receive the user's ID in the request body
    const userFound = await User.findById(userId);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    // Query the database to find ads posted by this user
    const ads = await Car.find({ seller: userId });
    console.log(ads);

    res.status(200).json({ message: "success", ads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEveryAd=(res,req,next)=>{

}