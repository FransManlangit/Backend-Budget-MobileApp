const mongoose = require("mongoose");

const cashSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

cashSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

cashSchema.set("toJSON", {
  virtuals: true,
});

exports.Cash = mongoose.model("Cash", cashSchema);


