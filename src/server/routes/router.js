const express = require("express");
const {
  getAllSessions,
  getOneSession,
  deleteOneSession,
  createSession,
} = require("../controllers/sessionsControllers/sessionsControllers");
const getAllUsers = require("../controllers/usersControllers/usersControllers");

const router = express.Router();
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", getOneSession);
router.delete("/sessions/:id", deleteOneSession);
router.post("/sessions/new", createSession);
router.get("/users", getAllUsers);

module.exports = router;
