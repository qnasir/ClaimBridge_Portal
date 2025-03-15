require("dotenv").config();
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db.js")

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: ['https://claimbridgeportal.vercel.app','http://localhost:8081'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET, POST, PUT, DELETE',
  }));
app.use(express.json({extended: false}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/claims', require('./routes/claims'));
app.get('/', (req,res) => {
  res.send("Express is saying Hello!");
})

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})