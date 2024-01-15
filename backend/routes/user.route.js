const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const UserRouter = express.Router();

// register user
UserRouter.post("/register", async (req, res) => {
  const payload = req.body;
  const { email, password } = payload;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "User Already Exists, Please Login!" });
    } else {
      bcrypt.hash(password, 6, async (err, hash) => {
        if (err) {
          res.status(400).json({ err });
        } else {
          payload.password = hash;
          const new_user = new UserModel(payload);
          await new_user.save();
          res.status(200).json({ msg: "New User Registered" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//login user
UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          res.status(400).json({ msg: "Invalid Password !" });
        } else {
          const token = jwt.sign(
            { userId: user._id },
            "masai",
            { expiresIn: "7d" }
          );
          res.status(200).json({ msg: "Logged In Successfully", token });
        }
      });
    } else {
      res.status(400).json({ msg: "Please Register first!" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { UserRouter };
