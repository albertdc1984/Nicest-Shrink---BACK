const User = require("../../../database/models/User");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("sessions doctor");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = getAllUsers;
