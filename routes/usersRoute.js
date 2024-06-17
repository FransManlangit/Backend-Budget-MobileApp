const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
  
    const secret = process.env.secret;
    if (!user) {
      return res.status(400).send("The user not found");
    }
  
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
  
        secret,
        { expiresIn: "1d" }
      );
  
      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("password is wrong!");
    }
  });

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-password");
  console.log(userList);

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

module.exports = router;
