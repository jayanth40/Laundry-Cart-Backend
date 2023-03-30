const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors');
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    withCredentials:true
  }));
  
app.use(express.json());


const postRoute = require('./routes/signup');

app.use('/', postRoute);

module.exports = app;
