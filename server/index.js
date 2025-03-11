require("dotenv").config();
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db.js")

const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors())

connectDB();
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})