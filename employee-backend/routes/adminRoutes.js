const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const router = express.Router();

/* ================= MAIL TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ================= SEND MAIL ================= */

router.post("/send-mail", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || to.length === 0)
      return res.status(400).json({ message: "Recipients required" });

    const mailOptions = {
      from: `"WorkTrack Admin" <${process.env.MAIL_USER}>`,
      to: to.join(","), // multiple recipients
      subject,
      html: `
  <div style="font-family:Arial;background:#f9fafb;padding:30px">
    <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px">

      <h2 style="color:#4f46e5">${subject}</h2>

      <p style="color:#374151">${message}</p>

      <p style="margin-top:30px;font-size:12px;color:#9ca3af">
        Sent via WorkTrack Admin Dashboard
      </p>

    </div>
  </div>
`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Mail sent successfully" });
    console.log("Mail sent successfully");

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mail sending failed" });
  }
});

module.exports = router;