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
  userLogin,
  updateUser,
  getOneUser,
  deleteOneUser,
} = require("../controllers/usersControllers/usersControllers");

const router = express.Router();
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", getOneSession);
router.delete("/sessions/:id", deleteOneSession);
router.post("/sessions/new", createSession);
router.patch("/sessions/:id", updateOneSession);
router.get("/users", getAllUsers);
router.get("/users/:id", getOneUser);
router.delete("/users/:id", deleteOneUser);
router.post("/users/new", createUser);
router.post("/users/login", userLogin);
router.patch("/users/:id", updateUser);
module.exports = router;
