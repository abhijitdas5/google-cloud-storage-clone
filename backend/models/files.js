const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
  name: String,
  userId: String   // 👈 IMPORTANT
})

module.exports = mongoose.model("File", fileSchema)