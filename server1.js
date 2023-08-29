const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path : './config/.env'});
const app = require('./app');

const PORT = 3500;

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
})