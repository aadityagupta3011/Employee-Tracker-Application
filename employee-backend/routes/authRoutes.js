const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Employee = require("../models/Employee");

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1hr" }
  );

  res.json({ token, role: user.role, employeeId: user.employeeId });
});

/* ================= GET LOGGED IN USER ================= */
router.get(
  "/me",
  authMiddleware(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= ADMIN CREATES EMPLOYEE ================= */
router.post(
  "/register-employee",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    const { name, email, password, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeId = "EMP" + Date.now();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      employeeId,
    });

    await Employee.create({
      employeeId,
      name,
      department,
      managerId: req.user.id,
    });

    res.json({
      message: "Employee created",
      employeeId,
      loginEmail: email,
      tempPassword: password,
    });
  }
);

module.exports = router;