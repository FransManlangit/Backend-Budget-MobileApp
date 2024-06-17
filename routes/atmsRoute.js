const express = require("express");
const { Atm } = require("../models/atm");
const { Income } = require("../models/income");
const { Cash } = require("../models/cash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const ErrorHandler = require("../helpers/error-handler");
const router = express.Router();

// Create new ATM entry
router.post("/newAtmEntry", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    const { name } = userExists;

    const atm = new Atm({
      userId,
      description: "Card",
      amount,
      name,
      date: new Date(),
    });

    const savedAtm = await atm.save();
    res.status(201).json(savedAtm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get ATM entries for admin
router.get("/getAdminAtmEntries", async (req, res, next) => {
  try {
    const atmEntries = await Atm.find().populate("userId");
    res.status(200).json(atmEntries);
  } catch (err) {
    next(err);
  }
});

// Get single ATM entry
router.get("/getSingleAtmEntry/:id", async (req, res, next) => {
  try {
    const atmEntry = await Atm.findById(req.params.id).populate("userId"); // Populate userId
    if (!atmEntry) {
      return res.status(404).json({ message: "ATM entry not found" });
    }
    res.status(200).json(atmEntry);
  } catch (error) {
    next(error);
  }
});

// Update ATM entry
router.put("/updateAtmEntry/:id", async (req, res, next) => {
  try {
    const { amount } = req.body;
    const atmEntry = await Atm.findByIdAndUpdate(req.params.id, { amount }, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!atmEntry) {
      return next(new ErrorHandler("ATM entry not found", 404));
    }

    res.status(200).json({ success: true, atmEntry });
  } catch (error) {
    next(error);
  }
});

// Delete ATM entry
router.delete("/deleteAtmEntry/:id", async (req, res, next) => {
  Atm.findByIdAndRemove(req.params.id)
    .then((atm) => {
      if (atm) {
        return res
          .status(200)
          .json({ success: true, message: "the atm is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "atm not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// Get total ATM amount
router.get("/getTotalAtmAmount", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const atmEntries = await Atm.find({ userId });

    let totalAtm = 0;
    atmEntries.forEach((entry) => {
      totalAtm += entry.amount;
    });

    res.status(200).json({ success: true, totalAtm });
  } catch (error) {
    next(error);
  }
});

// Withdraw money from ATM
router.post("/withdrawMoney", async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (amount <= 0) {
      return next(new ErrorHandler("Invalid withdrawal amount", 400));
    }

    let atmEntry = await Atm.findOne({ userId });

    if (!atmEntry || atmEntry.amount < amount) {
      return next(new ErrorHandler("Insufficient funds", 400));
    }

    atmEntry.amount -= amount;
    atmEntry = await atmEntry.save();

    let cashEntry = await Cash.findOne({ userId });

    if (!cashEntry) {
      const cashData = {
        description: "ATM Withdrawal",
        amount,
        date: new Date(),
        userId, // Ensure userId is used here
      };
      cashEntry = await Cash.create(cashData);
    } else {
      cashEntry.amount += amount;
      cashEntry = await cashEntry.save();
    }

    res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      atmEntry,
      cashEntry,
    });
  } catch (error) {
    next(error);
  }
});


// Add amount to ATM
router.post("/addAtmAmount/:id", async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    const atmEntry = await Atm.findByIdAndUpdate(
      req.params.id,
      { $inc: { amount } },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!atmEntry) {
      return next(new ErrorHandler("ATM entry not found", 404));
    }

    const incomeData = {
      description: "Added Cash",
      amount,
      date: new Date(),
      userId, // Ensure userId is used here
    };

    const income = await Income.create(incomeData);

    res.status(200).json({
      success: true,
      message: "Amount added to ATM entry successfully",
      atmEntry,
      income,
    });
  } catch (error) {
    next(error);
  }
});


// ATM Count
router.get("/atmCount", async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Atm.countDocuments({ userId });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
