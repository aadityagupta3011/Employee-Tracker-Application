const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  employeeId: String,
  email: String,
  imageUrl: String,
  reason: { type: String, default: "unauthorized_face" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
