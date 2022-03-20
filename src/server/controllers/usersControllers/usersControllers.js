const bcrypt = require("bcrypt");
const User = require("../../../database/models/User");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("sessions");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const user = req.body;
  const userHashed = {
    ...user,
    password: await bcrypt.hash(user.password, 10),
  };
  try {
    await User.create(userHashed);

    res.status(201).json({ user });
  } catch (error) {
    error.message = "username alredy exists";
    error.status = 409;
    next(error);
  }
};

module.exports = { getAllUsers, createUser };
