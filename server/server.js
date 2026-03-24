

// server/server.js
import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
}));

app.use(cors());

// File upload limit (5MB)
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

const API_KEY = "vVoqniibsY83QGgDfvyWmitL";

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    if (!req.file.mimetype.startsWith("image/")) return res.status(400).send("Only images allowed");

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, "image.png");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
      body: formData
    });

    if (!response.ok) return res.status(500).send("Remove.bg error");

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));