// ================= DATABASE =================
require("./config/db")

const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

// ================= MIDDLEWARE =================
app.use(cors())
app.use(express.json())

// ================= STATIC FILES =================

// 👉 frontend serve karega
app.use(express.static(path.join(__dirname, "models/frontend")))

// 👉 uploads folder public access (download ke liye)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// ================= ROUTES =================

// 👉 auth (login/register)
app.use("/auth", require("./routes/auth"))

// 👉 files (upload, get, delete)
app.use("/files", require("./routes/files"))

// ================= HOME ROUTE =================

// 👉 index page open hoga
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "models/frontend/index.html"))
})

// ================= SERVER START =================

const PORT = 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})