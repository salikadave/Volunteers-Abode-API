const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env.JWT_SECRET;
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log('token=',token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    console.log(req.userData);

    const {_id} = decoded
        User.findById(_id).then(userdata=>{
            req.user = userdata
            console.log(req.user)

            next()
        })

  } catch (err) {
    return res.status(401).json({
      message: "JWT Token not valid"
    });
  }

  
  
};