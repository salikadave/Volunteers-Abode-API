const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userType: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

mongoose.model("User", userSchema); 
