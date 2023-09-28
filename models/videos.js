const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema(
  {
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Videos", videosSchema);
