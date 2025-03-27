const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModal = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// Api for sending the connection request
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const AllowedStatus = ["interested", "ignored"];
      if (!AllowedStatus.includes(status)) {
        return res.status(400).send("Invalid status : " + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send({ message: "User not found!!!" });
      }

      const existingConnectionRequest = await ConnectionRequestModal.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request is already made." });
      }

      const connectionRequest = new ConnectionRequestModal({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} ${
          status === "interested" ? "is" : ""
        } ${status} ${status === "interested" ? "in" : ""} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
