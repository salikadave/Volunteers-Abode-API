const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    console.log(req.userData);
  } catch (err) {
    return res.status(401).json({
      message: "JWT Token not valid",
    });
  }
  next();
};