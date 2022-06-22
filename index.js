const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`)
})

require('dotenv').config()

// getting env variables
const API_BASE_URL = process.env.API_BASE_URL + '/forecast/daily';
const API_KEY_NAME = process.env.API_BASE_KEY;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

console.log(API_BASE_URL)
console.log(API_KEY_NAME)
console.log(API_KEY_VALUE)

const needle = require('needle')
const url = require('url')
const cors = require("cors")
app.use(cors())

//app.use(express.static(__dirname + 'public'))

const rateLimit = require('express-rate-limit').default

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 100, // maximum amount of requests per 10 mins
})

app.use(limiter)
app.set('trust proxy', 1)
const apicache = require("apicache");
let cache = apicache.middleware;

app.get("/forecast/daily", cache('2 minutes'), async (req, res) => {
    try {
      const params = new URLSearchParams({
        [API_KEY_NAME]: API_KEY_VALUE,
        ...url.parse(req.url, true).query,
      });
  
      const apiRes = await needle("get", `${API_BASE_URL}?${params}`);
        const data = apiRes.body.data; //removing country and location data
        console.log(data)
  
      // Log the request to the public API
      if (process.env.NODE_ENV !== "production") {
        console.log(`REQUEST: ${API_BASE_URL}?${params}`);
      }
  
        res.json({
          data:data
      })
    } catch (error) {
      console.log(error);
      //res.send(error)
    }
  });