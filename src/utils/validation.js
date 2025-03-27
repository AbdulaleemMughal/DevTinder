const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is Invalid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is Invalid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "age",
    "photo",
    "gender",
    "about",
  ];

  const isAllowedField = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowedField;
};

module.exports = { signUpValidation, validateEditProfileData };
