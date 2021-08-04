const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect to the database

connectDB();



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));


