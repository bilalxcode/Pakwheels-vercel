const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category schema
      ref: "Category", // The name of the Category model
      required: true,
    },
    price: String,
    quantity: String,
    description: String,
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
