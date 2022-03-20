const express = require("express");
const {
  getAllSessions,
  getOneSession,
  deleteOneSession,
  createSession,
  updateOneSession,
} = require("../controllers/sessionsControllers/sessionsControllers");
const {
  getAllUsers,
  createUser,
} = require("../controllers/usersControllers/usersControllers");

const router = express.Router();
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", getOneSession);
router.delete("/sessions/:id", deleteOneSession);
router.post("/sessions/new", createSession);
router.patch("/sessions/:id", updateOneSession);
router.get("/users", getAllUsers);
router.post("/users/new", createUser);

module.exports = router;
