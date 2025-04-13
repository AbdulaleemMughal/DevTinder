const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true, // The email should not be empty
    unique: true, // the emailId should be unique
    lowercase: true, // convert the email into lowercase
    trim: true, // remove the white spaces from the email only from start and the last
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Please enter a strong password");
      }
    },
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender should be either 'male', 'female' or 'other'");
      }
    },
  },
  photo: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid Photo URL");
      }
    },
  },
  about: {
    type: String,
  },
  skills: {
    type: [Object],
    validate: {
      validator: function (value) {
        return value.length <= 10; // Ensure the array has no more than 10 elements
      },
      message: "The number of skills should not exceed 10.",
    },
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEVTINDER@123", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashedPassword = user.password

    const isPasswordValidate = await bcrypt.compare(passwordInputByUser, hashedPassword);

    return isPasswordValidate;
};


const User = mongoose.model("User", userSchema);
module.exports = User;
