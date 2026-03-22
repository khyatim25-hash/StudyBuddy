const User = require("../models/User");
const Organization = require("../models/Organization");

exports.signupUser = async (req, res) => {

  try {

    const { role, name, email, password, organizationCode, className, stream } = req.body;

    const org = await Organization.findOne({ organizationCode });

    if (!org) {

      return res.status(400).json({ message: "Invalid Organization Code" });

    }

    const user = await User.create({

      role,
      name,
      email,
      password,
      organizationCode,
      class: className,
      stream

    });

    res.json(user);

  } catch (error) {

    res.status(500).json(error);

  }

};