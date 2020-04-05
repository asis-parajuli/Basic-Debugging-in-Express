function log(req, res, next) {
  console.log("Logging....");
  next();
  // if we dont use next the our system will be hanging because we didnt pass the control to the next function the existing middleware funtion cycle wont terminate
  // next pass funtion to next middleware funtion
}

// here next indicates instance to next funtion
module.exports = log;
