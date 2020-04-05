function authenticator(req, res, next) {
  console.log("Authenticating....");
  next();
}

// here next indicates instance to next funtion
module.exports = authenticator;
