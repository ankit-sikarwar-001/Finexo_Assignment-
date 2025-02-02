const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { processFile } = require("../controllers/fileController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx files are allowed"));
    }
  },
});

// Upload Route
router.post("/upload", upload.single("file"), processFile);

module.exports = router;
