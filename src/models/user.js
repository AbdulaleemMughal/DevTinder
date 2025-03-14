const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,// the email should not be empty
        unique: true, // the emailId should be unique
        lowercase: true, // convert the email into lowercase
        trim: true, // remove the white spaces from the email only from start and the last
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password");
            }
        },
    },
    age: {
        type: Number,
        min: 18  // define the minimum age of the user
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender should be either 'male', 'female' or 'other'");
            }
        }
    },
    photo: {
        type: String,
        default: "https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg", // it store the default value for the attribute
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about of the user..."
    },
    skills: {
        type: [String],
        validate: {
            validator: function(value) {
              return value.length <= 10; // Ensure the array has no more than 10 elements
            },
            message: 'The number of skills should not exceed 10.'
          }
    }
});

// Either write like this.
const User = mongoose.model("User", userSchema);
module.exports = User;

// Or writelike this.
// module.exports = mongoose.Model("User", userSchema);