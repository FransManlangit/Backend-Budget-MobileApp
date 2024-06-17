const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema({
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

expensesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

expensesSchema.set("toJSON", {
  virtuals: true,
});

exports.Expenses = mongoose.model("Expenses", expensesSchema);
