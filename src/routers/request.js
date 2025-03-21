const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation")

const requestRouter = express.Router();

// Api for sending the connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " send you connection request.");
});

module.exports = requestRouter;
