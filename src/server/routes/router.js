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
const auth = require("../middlewares/auth");

const router = express.Router();
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", auth, getOneSession);
router.delete("/sessions/:id", auth, deleteOneSession);
router.post("/sessions/new", auth, createSession);
router.patch("/sessions/:id", auth, updateOneSession);
router.get("/users", auth, getAllUsers);
router.get("/users/:id", getOneUser);
router.delete("/users/:id", auth, deleteOneUser);
router.post("/users/new", createUser);
router.post("/users/login", userLogin);
router.patch("/users/:id", auth, updateUser);
module.exports = router;
