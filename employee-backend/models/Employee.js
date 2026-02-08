const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  department: String,
  managerId: String,
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
