const mongoose = require("mongoose");

const baggageImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  fileType: {
    type: String,
    required: true,
  },
  fileHash: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BaggageImage", baggageImageSchema);
