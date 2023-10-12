const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      default: null,
    },
    modelYear: {
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
      type: Number,
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
      default: null,
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
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
