const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ActivityLog = require("../models/ActivityLog");
const Incident = require("../models/Incident");
const User = require("../models/User");

const router = express.Router();

/* ============================
   ADMIN DASHBOARD
============================ */
router.get(
  "/admin",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);

      // Get today's activity logs
      const logs = await ActivityLog.find({});

      const result = [];

      for (const log of logs) {
        const user = await User.findOne({
          employeeId: log.employeeId
        });

        if (!user) continue;

        const total = log.activeSeconds + log.idleSeconds;

        result.push({
          employeeId: log.employeeId,
          name: user.name,
          email: user.email,
          activeSeconds: log.activeSeconds,
          idleSeconds: log.idleSeconds,
          focusScore:
            total > 0
              ? ((log.activeSeconds / total) * 100).toFixed(2)
              : 0
        });
      }

      res.json(result);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ============================
   EMPLOYEE DASHBOARD
   - See own data only
============================ */
router.get(
  "/employee",
  authMiddleware(["EMPLOYEE"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const today = new Date().toISOString().slice(0, 10);

      const log = await ActivityLog.findOne({
        employeeId: user.employeeId,
        date: today
      });

      if (!log) {
        return res.json(null);
      } 

      const total = log.activeSeconds + log.idleSeconds;

      res.json({
        employeeId: log.employeeId,
        email: log.email,
        activeSeconds: log.activeSeconds,
        idleSeconds: log.idleSeconds,
        passiveSeconds: log.passiveSeconds,
        focusScore:
          total > 0
            ? ((log.activeSeconds / total) * 100).toFixed(2)
            : 0,
        appUsage: log.appUsage,
        lastUpdated: log.lastUpdated
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/admin/summary",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const today = req.query.date || new Date().toISOString().slice(0, 10);

      const logs = await ActivityLog.find({ date: today });

      let totalActive = 0;
      let totalIdle = 0;

      logs.forEach(log => {
        totalActive += log.activeSeconds;
        totalIdle += log.idleSeconds;
      });

      const total = totalActive + totalIdle;

      res.json({
        totalEmployees: logs.length,
        totalActive,
        totalIdle,
        overallFocus:
          total > 0
            ? ((totalActive / total) * 100).toFixed(2)
            : 0
      });

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/admin/employee/:employeeId/app-usage",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const logs = await ActivityLog.find({
        employeeId: req.params.employeeId
      });

      let combinedUsage = {};

      logs.forEach(log => {
        if (log.appUsage) {
          log.appUsage.forEach((seconds, app) => {
            combinedUsage[app] =
              (combinedUsage[app] || 0) + seconds;
          });
        }
      });

      res.json({
        employeeId: req.params.employeeId,
        appUsage: combinedUsage
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// router.get(
//   "/admin/employee/:employeeId",
//   authMiddleware(["ADMIN"]),
//   async (req, res) => {
//     try {
//       const logs = await ActivityLog.find({
//         employeeId: req.params.employeeId
//       });

//       let combinedUsage = {};

//       logs.forEach(log => {
//         if (log.appUsage) {
//           Object.entries(log.appUsage).forEach(([app, seconds]) => {
//             combinedUsage[app] =
//               (combinedUsage[app] || 0) + seconds;
//           });
//         }
//       });

//       res.json({ appUsage: combinedUsage });

//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );



/* ============================
   ADMIN INCIDENTS LIST
============================ */
router.get(
  "/admin/incidents",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const incidents = await Incident.find().sort({ createdAt: -1 });
      res.json(incidents);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ============================
   EMPLOYEE INCIDENTS (OWN)
============================ */
router.get(
  "/employee/incidents",
  authMiddleware(["EMPLOYEE"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const incidents = await Incident.find({
        employeeId: user.employeeId
      }).sort({ createdAt: -1 });

      res.json(incidents);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
