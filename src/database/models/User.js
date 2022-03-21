const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  _id: {
    type: String,
  },

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
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Session",
  },
  progress: {
    type: String,
    default: "Not progressing",
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
