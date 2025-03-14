const express = require("express");
const connectDataBase = require("./config/database");
const User = require("./models/user");
const { signUpValidation } = require("./utils/signUpValidation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json()); // to parse json request

// Api for signing up the users.
app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);  res.body contains all the data that is written in the body sessiojn of the postman

    const { firstName, lastName, emailId, password } = req.body;

    // validate user input
    signUpValidation(req);

    //Enccrpt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save(); // Save user to MongoDB
    res.send("User registered successfully");
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// Api for logining In the user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new Error("Invalid Credentials");
    } else {
      res.send("Login Successful");
    }
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// Api for fetching the one user profile
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail }); // find the one user
    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});

// Api for fetching the the arrayof user profile
app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});

// deleteing a user from the databse
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});

// updating a user from the databse
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // API Level Validation

    const ALLOWED_UPDATES = ["age", "gender", "skills", "photo", "about"]; // Only these keys from the schema will be allowed to update from the schema

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid updates");
    }

    // validation for the maximun length forskills array or alsowe canvalidate it into the schema
    // if(data?.skills.length > 10) {
    //   throw new Error("Skills array should not have more than 10 elements");
    // }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true, // it help us to run the validation on updating any user data
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
  }
});

connectDataBase()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while Connecting the Database", err.message);
  });
