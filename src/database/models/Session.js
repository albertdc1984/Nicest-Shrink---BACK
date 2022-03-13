const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const sessionSchema = new Schema({
  when: {
    type: Date,
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
});

const Session = model("Session", sessionSchema, "sessions");

module.exports = Session;
