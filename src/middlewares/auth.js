const adminAuth = (req, res, next) => {
    console.log("Admin Auth is checking")
  const token = "asdghasdsad";
  const isAdminAuthorized = token === "asdghasdsad";
  if (!isAdminAuthorized) {
    return res.status(401).send("Unauthorized Admin");
  } else {
    next();
  }
};

module.exports = { adminAuth };
