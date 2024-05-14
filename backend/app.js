const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
    createUser
} 
= require("./Controllers/AuthController");

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// log request middleware
app.use((req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// test route
app.get('/test', (req,res) => {
    res.send('test');
});

// Auth Routes
app.post("/create-user", createUser);

// Db connection and app start
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to db and listening at http://localhost:${process.env.PORT}/`)
    });
})
.catch(err => console.error(`error: ${err}`))
