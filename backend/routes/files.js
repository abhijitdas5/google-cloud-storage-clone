const express = require("express")
const router = express.Router()

const File = require("../models/files")
const multer = require("multer")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

// storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// ================= UPLOAD =================
router.post("/", upload.single("file"), async (req, res) => {

  const token = req.headers.authorization
  const decoded = jwt.verify(token, "secret123")

  if (!req.file) {
    return res.json({ message: "No file uploaded ❌" })
  }

  const file = new File({
    name: req.file.filename,
    size: req.file.size || 0,        // ✅ FIX
    type: req.file.mimetype || "unknown", // ✅ FIX
    userId: decoded.id
  })

  await file.save()

  res.json({ message: "Uploaded ✅" })
})

// ================= GET FILES =================
router.get("/", async (req, res) => {

  const token = req.headers.authorization
  const decoded = jwt.verify(token, "secret123")

  const files = await File.find({ userId: decoded.id })
  res.json(files)
})

// ================= SEARCH =================
router.get("/search", async (req, res) => {

  const token = req.headers.authorization
  const decoded = jwt.verify(token, "secret123")

  const query = req.query.q

  const files = await File.find({
    userId: decoded.id,
    name: { $regex: query, $options: "i" }
  })

  res.json(files)
})

// ================= DELETE (by name) =================
router.delete("/:name", async (req, res) => {

  const filename = req.params.name

  await File.deleteOne({ name: filename })

  const filePath = path.join("uploads", filename)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  res.json({ message: "Deleted ✅" })
})

module.exports = router