const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      default: null,
    },
    modelName: {
      type: String,
      default: null,
    },
    registeredIn: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    mileage: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    engineType: {
      type: String,
      default: null,
    },
    transmission: {
      type: String,
      default: null,
    },
    engineCapacity: {
      type: String,
      default: null,
    },
    assembly: {
      type: String,
      default: null,
    },
    features: [
      {
        type: String,
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    sellerContact: {
      type: String,
      default: null,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        type: String, // You can use String to store image URLs
        // If you want to store references to image documents, you can use mongoose.Schema.Types.ObjectId
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);