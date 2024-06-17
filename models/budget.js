const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
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
});

budgetSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

budgetSchema.set("toJSON", {
  virtuals: true,
});

exports.Budget = mongoose.model("Budget", budgetSchema);

