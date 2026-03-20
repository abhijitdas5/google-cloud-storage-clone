const express = require("express")
const router = express.Router()

const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const SECRET = "secret123"

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    // check existing user
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists" })
    }

    // hash password
    const hash = await bcrypt.hash(password, 10)

    // save user
    const user = new User({
      email,
      password: hash
    })

    await user.save()

    res.json({ message: "Registered successfully ✅" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" })
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" })
    }

    // create token
    const token = jwt.sign({ id: user._id }, SECRET)

    res.json({
      message: "Login successful ✅",
      token
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router