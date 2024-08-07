const mongoose = require('mongoose');
const { number } = require('zod');
require('dotenv').config();
const Mongo_url = process.env.MONGO_URL;

mongoose.connect(Mongo_url)
.then(()=>{
    console.log('databse connected successfully');
})
.error((err)=>{
    console.log(err);
})

const user_schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,

    },
    FirstName:{
        type: String,
        required: true,
        trim: true,
    },
    LastName:{
        type: String,
        required: true,
        trim: true,
    }

});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,

    },
    balance:{
        type: number,
        required: true,
    }
})

const USER = mongoose.model('USER', user_schema);
const Account = mongoose.model("Account",accountSchema)



module.exports = {
    USER,
    Account,
}

