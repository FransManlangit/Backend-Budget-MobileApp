const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
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

savingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

savingSchema.set("toJSON", {
  virtuals: true,
});

exports.Saving = mongoose.model("Saving", savingSchema);
