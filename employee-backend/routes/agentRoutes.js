const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const upload = require("../middleware/upload");
const Incident = require("../models/Incident");

const router = express.Router();


const sanitizeAppUsage = (usage) => {
  const cleaned = {};

  for (let key in usage) {
    const safeKey = key.replace(/\./g, "_");
    cleaned[safeKey] = usage[key];
  }

  return cleaned;
};

router.post(
  "/activity",
  authMiddleware(["EMPLOYEE"]),
  async (req, res) => {
    try {
      const { active, idle, passive, fakeMouse, appUsage } = req.body;

      const user = await User.findById(req.user.id);
      const today = new Date().toISOString().slice(0, 10);

      const update = {
        $inc: {
          activeSeconds: active,
          idleSeconds: idle,
          passiveSeconds: passive
        },
        $set: {
          email: user.email,
          lastUpdated: new Date()
        },
        $setOnInsert: {
          employeeId: user.employeeId,
          date: today
        }
      };

      if (fakeMouse) {
        update.$set.fakeMouseDetected = true;
      }

      if (appUsage) {
        update.$set.appUsage = sanitizeAppUsage(appUsage);
      }

      await ActivityLog.findOneAndUpdate(
        { employeeId: user.employeeId, date: today },
        update,
        { upsert: true, new: true }
      );

      res.json({ message: "Activity updated" });

    } catch (err) {
      console.error("❌ Activity error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// =======================
// INCIDENT (SUSPECT IMAGE)
// =======================
router.post(
  "/incident",
  authMiddleware(["EMPLOYEE"]),
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🔥 INCIDENT ENDPOINT HIT");

      if (!req.file) {
        console.log("❌ No file received");
        return res.status(400).json({ message: "No image uploaded" });
      }

      console.log("☁️ Cloudinary URL:", req.file.path);

      const user = await User.findById(req.user.id);

      await Incident.create({
        employeeId: user.employeeId,
        email: user.email,
        imageUrl: req.file.path
      });

      res.json({ message: "Incident uploaded to Cloudinary" });
    } catch (err) {
      console.error("❌ INCIDENT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
