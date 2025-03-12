const express = require("express");
const connectDataBase = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // to parse json request

app.post("/signup", async (req, res) => {
  // console.log(req.body);  res.body contains all the data that is written in the body sessiojn of the postman

  const user = new User(req.body);

  try {
    await user.save(); // Save user to MongoDB
    res.send("User registered successfully");
  } catch (err) {
    // handling error if occur
    res.status(400).send("Error saving the User" + err.message);
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true // it help us to run the validation on updating any user data
    });
    res.send("User Updated Successfully")
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
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
