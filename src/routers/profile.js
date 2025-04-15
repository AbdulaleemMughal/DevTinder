const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

const profileRouter = express.Router();

// Api for fetching the user profile

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data edit");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, you Data is Edited Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    // handling error if occur
    res.status(400).json({
      message: "Error Occur while editing"
    });
  }
});

// Api for updating the profile password
profileRouter.put("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password should be strong (min 8 chars, include uppercase, lowercase, number, and symbol).",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.send("Password Updating successfully!");
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
