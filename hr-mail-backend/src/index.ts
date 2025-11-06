import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// --- Handle __dirname and __filename manually ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Define the interface (still works if you’re using TypeScript)
interface EmailData {
  to: string;
  subject: string;
  html: string;
  plaintext: string;
}

// Multer setup for file uploads
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
});

// Initialize transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route
app.post("/api/mail/send", upload.single("file"), async (req, res) => {
  try {
    const data: EmailData = req.body;
    const file = req.file;

    if (!data.to || !data.subject || !data.plaintext || !data.html) {
      return res.status(400).json({ error: "Missing required email fields" });
    }

    const mail: any = {
      from: `"HR Bot" <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.plaintext,
    };

    // Attach file if uploaded
    if (file) {
      mail.attachments = [
        {
          filename: file.originalname,
          path: file.path,
        },
      ];
    }

    await transporter.sendMail(mail);

    // Remove uploaded file after sending
    if (file) {
      fs.unlinkSync(file.path);
    }

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
