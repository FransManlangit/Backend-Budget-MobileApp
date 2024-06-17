const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
    enum: {
      values: ["On Hand", "ATM", "Added Cash", "Salary"],
    },
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

incomeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

incomeSchema.set("toJSON", {
  virtuals: true,
});

exports.Income = mongoose.model("Income", incomeSchema);
