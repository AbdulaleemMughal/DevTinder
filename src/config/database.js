const mongoose = require("mongoose");

const connectDataBase = async () => {
  await mongoose.connect(
    "mongodb+srv://AbdulAleem:qaK30MkDaJBeJxgn@namastenode.2dq6g.mongodb.net/devTinder"
  );
};



module.exports = connectDataBase;