const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoute = require('./Routes/authRoutes');
const userRoute = require('./Routes/userRoutes');
const questionRoute = require('./Routes/questionRoutes');

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/question", questionRoute);

app.get("/", (req,res) => {
    res.send("it-works")
})

// log request middleware
app.use((req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// test route
app.get('/test', (req,res) => {
    res.send('test');
});



// Db connection and app start
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to db and listening at http://localhost:${process.env.PORT}/`)
    });
})
.catch(err => console.error(`error: ${err}`))
