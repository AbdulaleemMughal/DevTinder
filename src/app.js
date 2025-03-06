const express = require("express");
const connectDataBase = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "viratkohli@gmail.com",
    password: "qaK30MkDaJBeJxgn",
  });

  try {
    await user.save(); // Save user to MongoDB
    res.send("Virat Kohli registered successfully");
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error saving the User" + err.message);
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
    console.log("Error while Connecting the Database");
  });
