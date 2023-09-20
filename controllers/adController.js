const User = require("../models/user");
const Car = require("../models/car");

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
    .then(() => {
      console.log("New Car added successfully without approval ");
      return res
        .status(200)
        .json({ message: "New Car added successfully without approval" });
    })
    .catch((error) => {
      console.error("Error adding new car:", error);
      res.json({ error: "Error adding new car" }); // Send a JSON response
    });
};
// Backend Route to Handle Image Uploads
exports.addCarImage = async (req, res, next) => {
  console.log("working");
  res.status(200).json({ message: "okay" });
};
