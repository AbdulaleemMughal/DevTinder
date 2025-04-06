const express = require("express");
const connectDataBase = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");

const app = express();

app.use(express.json()); // middle-ware to parse json request
app.use(cookieParser()); // middle-ware for parsing cookies

app.use("/", authRouter); // middle-ware
app.use("/", profileRouter); // middle-ware
app.use("/", requestRouter); // middle-ware
app.use("/", userRouter); // middle-ware

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
