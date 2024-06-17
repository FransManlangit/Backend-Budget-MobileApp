const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});


transactionSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  transactionSchema.set("toJSON", {
    virtuals: true,
  });
  
  exports.Transaction = mongoose.model("Transaction", transactionSchema);