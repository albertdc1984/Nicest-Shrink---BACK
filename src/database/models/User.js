const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  sessions: {
    type: [Schema.Types.ObjectId],
  },
  progress: {
    type: String,
    default: "Not progressing",
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
