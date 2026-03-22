const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  role: String,

  name: String,

  email: String,

  password: String,

  organizationCode: String,

  class: String,

  stream: String

});

module.exports = mongoose.model("User", UserSchema);