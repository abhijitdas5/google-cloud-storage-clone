const express = require("express")
const router = express.Router()

const File = require("../models/files")
const multer = require("multer")
const jwt = require("jsonwebtoken")

// storage setup
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

  const file = new File({
    name: req.file.filename,
    userId: decoded.id   // 👈 user wise save
  })

  await file.save()
  res.json({ message: "File uploaded ✅" })
})

// ================= GET FILES =================
router.get("/", async (req, res) => {
  const token = req.headers.authorization
  const decoded = jwt.verify(token, "secret123")

  const files = await File.find({ userId: decoded.id }) // 👈 filter
  res.json(files)
})

// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  await File.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted ✅" })
})

module.exports = router