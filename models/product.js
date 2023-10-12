const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true,
    },
    price: String,
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
