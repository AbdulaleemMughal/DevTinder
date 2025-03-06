const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    }
});

// Either write like this.
const User = mongoose.model("User", userSchema);
module.exports = User;

// Or writelike this.
// module.exports = mongoose.Model("User", userSchema);