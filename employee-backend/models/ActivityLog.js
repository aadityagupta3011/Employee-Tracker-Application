const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true
    },

    email: {
      type: String,
      required: true
    },

    date: {
      type: String, // keep string for daily grouping simplicity
      required: true
    },

    activeSeconds: {
      type: Number,
      default: 0
    },

    idleSeconds: {
      type: Number,
      default: 0
    },

    passiveSeconds: {
      type: Number,
      default: 0
    },

    appUsage: {
      type: Map,
      of: Number,
      default: {}
    },

    fakeMouseDetected: {
      type: Boolean,
      default: false
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate daily logs
activitySchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ActivityLog", activitySchema);
