const express = require("express");
const connectDataBase = require("./config/database");
const User = require("./models/user");
const { signUpValidation } = require("./utils/signUpValidation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); // middle-ware to parse json request
app.use(cookieParser()); // middle-ware for parsing cookies

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

    const isCorrectPassword = await user.validatePassword(password);
    
    if (isCorrectPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000), // expire in 7 days
      });

      console.log("Token is : " + token);

      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// Api for fetching the user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error : " + err.message);
  }
});

// Api for sending the connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " send you connection request.");
});

// Connect to the server and the database....
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
