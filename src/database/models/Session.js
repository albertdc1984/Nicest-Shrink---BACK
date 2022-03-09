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
    type: Schema.Types.ObjectId,
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Session = model("Session", sessionSchema, "sessions");

module.exports = Session;
