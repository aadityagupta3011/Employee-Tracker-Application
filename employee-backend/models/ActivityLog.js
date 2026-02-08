const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  employeeId: String,
  email: String,
  date: String, // "2026-02-04"

  activeSeconds: { type: Number, default: 0 },
  idleSeconds: { type: Number, default: 0 },
  passiveSeconds: { type: Number, default: 0 },

  appUsage: {
    type: Object,
    default: {}
  },

  fakeMouseDetected: { type: Boolean, default: false },

  lastUpdated: { type: Date, default: Date.now }
});
activitySchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ActivityLog", activitySchema);
