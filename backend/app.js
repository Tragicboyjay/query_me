const express = require('express');
const app = express();
require('dotenv').config()

// test route
app.get('/', (req,res) => {
    res.send('test');
})

app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`)
});