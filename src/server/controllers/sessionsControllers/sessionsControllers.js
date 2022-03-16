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
    const session = await Session.findById(id).populate("doctor patient");

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
const deleteOneSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.findByIdAndRemove(id);

    if (session) {
      res.json({ message: "Session deleted" });
    } else {
      const error = new Error("Session not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const newSession = await Session.create(req.body);
    if (newSession) {
      res.json(newSession);
    } else {
      const error = new Error("Invalid data format");
      error.code = 400;
      next(error);
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't create session";
    next(error);
  }
};
module.exports = {
  getAllSessions,
  getOneSession,
  deleteOneSession,
  createSession,
};
