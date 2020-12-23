const express = require("express")
const helmet = require("helmet")
const async = require("async")
const cors = require("cors")

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())

const URL = "https://api.nasa.gov/planetary/apod"

server.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true })
})

module.exports = server
