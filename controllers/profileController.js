const User = require("../models/user");
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId; // Get the user's ID from the request body
    const updatedPhoneNumber = req.body.updatedPhoneNumber;
    const updatedName = req.body.updatedName;
    const updatedCity = req.body.updatedCity;
    const selectedGenderValue = req.body.selectedGenderValue;

    // Find the user by ID and update their data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: updatedName,
        phoneNumber: updatedPhoneNumber,
        city: updatedCity,
        gender: selectedGenderValue,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    console.error("Profile Update error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
