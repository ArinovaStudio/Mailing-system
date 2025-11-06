import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs"

const app = express();
app.use(express.json());

interface EmailData {
  to: string;
  subject: string;
  html: string;
  plaintext: string;
}

// Multer setup for file uploads (store locally in /uploads)
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
app.post(
  "/api/mail/send",
  upload.single("file"),
  async (req: Request, res: Response) => {
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

      // If file uploaded, add as attachment
      if (file) {
        mail.attachments = [
          {
            filename: file.originalname,
            path: file.path,
          },
        ];
      }

      await transporter.sendMail(mail);

      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending mail:", error);
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
