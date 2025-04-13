const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { signUpValidation } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);  res.body contains all the data that is written in the body sessiojn of the postman

    const { firstName, lastName, emailId, password } = req.body;

    // validate user input
    signUpValidation(req);

    //Enccrpt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      photo,
      about,
      skills,
      age,
      gender
    });

    await user.save(); // Save user to MongoDB
    res.send("User registered successfully");
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// Api for logining In the user
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isCorrectPassword = await user.validatePassword(password);

    if (isCorrectPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000), // expire in 7 days
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// API for logining Out the user
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()), // expire immediately
  });

  res.send("Logout Successfully");
});

module.exports = authRouter;
