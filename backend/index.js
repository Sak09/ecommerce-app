const express = require('express')
const cors = require('cors')
const bcrypt = require("bcrypt");
require('dotenv').config();
const connectDB = require('./config/db')
const router = require('./routes')
const app = express()
const path = require("path");
const cookieParser = require('cookie-parser')
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});
app.use('/api',router)
app.use(cookieParser())
const PORT = 8000 || process.env.PORT
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server is running on port', PORT);
            console.log('Connected to DB');
        });
    })
    .catch((err) => {
        console.error('Error connecting to DB:', err.message);
        process.exit(1);
    });

