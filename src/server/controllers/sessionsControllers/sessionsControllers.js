const Session = require("../../../database/models/Session");

const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .populate("patient")
      .populate("doctor");

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

const getOneSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.findById(id)
      .populate("patient")
      .populate("doctor");

    if (session) {
      res.json(session);
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

module.exports = { getAllSessions, getOneSession };
