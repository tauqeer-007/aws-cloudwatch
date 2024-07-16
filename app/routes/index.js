const express = require('express')
const router = express.Router()
const LogController = require('../../app/controllers/LogController')

router.get("/", (req, res) => {
    res.json({ "Api": "POC CloudWatch", version: "1" })
})

router.get("/addLog", LogController.addLog);

module.exports = router

