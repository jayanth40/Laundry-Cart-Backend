const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL
dotenv.config();
//connect to DB
mongoose.connect('mongodb+srv://Rohit:rohit@cluster0.vrcqw6n.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true }).
then(()=>{console.log("connected To DB")}).catch((err)=>{console.log(err);})


app.listen(8080, () => console.log('Server running......'));