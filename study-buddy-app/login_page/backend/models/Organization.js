const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({

  ownerName: String,

  ownerEmail: String,

  password: String,

  organizationName: String,

  organizationCode: {
    type: String,
    unique: true
  }

});

module.exports = mongoose.model("Organization", OrganizationSchema);