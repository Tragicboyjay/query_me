const express = require('express');
const app = express();
require('dotenv').config()
const mongoose = require('mongoose');

// test route
app.get('/test', (req,res) => {
    res.send('test');
})

// Db connection and app start
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to db and listening at http://localhost:${process.env.PORT}/`)
    });
})
.catch(err => console.error(`error: ${err}`))
