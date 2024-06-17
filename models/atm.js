const mongoose = require("mongoose");

const atmSchema = new mongoose.Schema({
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

atmSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  atmSchema.set("toJSON", {
    virtuals: true,
  });
  
  exports.Atm = mongoose.model("Atm", atmSchema);
  
