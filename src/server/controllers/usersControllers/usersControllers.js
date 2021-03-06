const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("shrink:user:");
const User = require("../../../database/models/User");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("sessions");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("sessions");
    res.json(user);
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

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const userUpdate = req.body;
  try {
    const session = await User.findByIdAndUpdate(id, userUpdate);

    if (session) {
      res.json({ userUpdate });
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't update user";
    next(error);
  }
};

const deleteOneUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndRemove(id);

    if (user) {
      res.json({ message: "User deleted" });
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("User not found");
    error.code = 401;
    debug(error);
    return next(error);
  }

  const rightPassword = await bcrypt.compare(password, user.password);

  if (!rightPassword) {
    const error = new Error("User not found");
    error.code = 401;
    debug(error);
    return next(error);
  }
  // eslint-disable-next-line no-underscore-dangle
  const userdata = { name: user.name, id: user._id };
  const token = jwt.sign(userdata, process.env.JWT_SECRET, {
    expiresIn: "4d",
  });

  return res.json({ token });
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  userLogin,
  deleteOneUser,
};
