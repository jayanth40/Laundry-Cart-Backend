const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true},
    phone:{type:Number,
    required:true,
    },
    stateName:String,
    district:String,
    pincode:Number,
    address:String,
    password:String
});


const OrderSchema = new mongoose.Schema({
    items: [
        {
            productName: String,
            quantity: Number,
            washType: String,
            price: Number,
        }
    ],
    userAddress:
    {
        stateName: String,
        district: String,
        pincode: Number,
        address: String
    }
    ,
    orderStatus: String,
    storePhoneNo: String,
    city: String,
    userId: String,
    storeAddress: String,
    billAmt: Number,
    storeLocation: String,
    orderDate: String
});
const User = mongoose.model('user',UserSchema)
const Order = mongoose.model('order',OrderSchema)
module.exports = {User,Order}
