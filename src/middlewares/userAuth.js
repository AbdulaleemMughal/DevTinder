const userAuth = (req, res, next) => {
  console.log("UserAuthorization is Checking...");
  const token = "abcd";
  const isUserAuthorized = token === "abcd";

  if (!isUserAuthorized) {
    return res.status(401).send("UnAuthorized User");
  } else {
    next();
  }
};

module.exports = { userAuth };
