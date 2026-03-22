const Organization = require("../models/Organization");

function generateCode() {

  return Math.random().toString(36).substring(2,8).toUpperCase();

}

exports.createOrganization = async (req, res) => {

  try {

    const { ownerName, ownerEmail, password, organizationName } = req.body;

    const code = generateCode();

    const org = await Organization.create({

      ownerName,
      ownerEmail,
      password,
      organizationName,
      organizationCode: code

    });

    res.json(org);

  } catch (error) {

    res.status(500).json(error);

  }

};