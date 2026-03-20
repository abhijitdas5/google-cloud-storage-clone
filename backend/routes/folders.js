const router = require("express").Router()

let folders = []

router.post("/create",(req,res)=>{

const {name} = req.body

folders.push({name})

res.json("Folder created")

})

router.get("/",(req,res)=>{

res.json(folders)

})

module.exports = router