require("dotenv").config()
const express = require("express")
const helmet = require("helmet")
const async = require("async")
const cors = require("cors")
const { default: axios } = require("axios")

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())

const URL = "https://api.nasa.gov/planetary/apod"
const api_key = process.env.API_KEY

server.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true })
})

server.get("/api/photos", (req, res) => {
  const days = req.query.days
  const dates = generateDates(days)

  const functionArray = dates.map((date) => {
    return async function () {
      const data = await axios.get(`${URL}?api_key=${api_key}&date=${date}`)
      return data.data
    }
  })

  async.parallel(functionArray, (err, result) => {
    res.status(200).json({ items: result.length, photos: result })
  })
})

function generateDates(numberOfDays) {
  const result = []
  const today = new Date()

  for (let i = 0; i < numberOfDays; i++) {
    let date = new Date(today)
    date.setDate(today.getDate() - i)
    let dd = date.getDate()
    let mm = date.getMonth() + 1
    let yyyy = date.getFullYear()

    if (dd < 10) {
      dd = "0" + dd
    }
    if (mm < 10) {
      mm = "0" + mm
    }
    date = yyyy + "-" + mm + "-" + dd
    result.unshift(date)
  }

  return result
}

module.exports = server
