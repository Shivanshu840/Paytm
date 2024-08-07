const express = require('express');
const router = express.Router();
const zod = require('zod');
const jwt = require('jsonwebtoken');
const {USER} = require('../Db/db');
const authMiddleWare = require("../MiddleWare/check")
const jwt_key = process.env.KEY;


const schema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    FirstName: zod.string(),
    LastName: zod.string()

    
})

const update = zod.object({
    password: zod.string().optional(),
    FirstName: zod.string().optional(),
    LastName: zod.string().optional()

    
})

router.post("/signup", async function(req,res){
    const {success} = schema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Invalid Input"
        })
    }

    const exuser = await USER.findOne(req.body.username);

    if(exuser){
        return res.status(411).json({
            msg: "user already exists"
        })
    }

    const {user_data} = req.body;

   const user =  await USER.create({
        username: user_data.username,
        password: user_data.password,
        FirstName: user_data.FirstName,
        LastName: user_data.LastName
    })
    const userId = user._id;

    const token = jwt.sign({userId},jwt_key);

   return res.status(200).json({
        msg: " user signup successfully",
        token: token
    })


});

router.post("/signin", async function(req,res){
    const {user_data} = req.body;

    const user = await USER.findOne({
        username: user_data.username,
        password: user_data.password
    })

    if(!user){
        return res.status(403).json({msg: "Invalid Credentials"})
    }else{
        const userId = user._id;
        const token = jwt.sign({userId}, jwt_key);
       return  res.status(200).json({
            msg: "User Loged in successfully",
            token : token
        })
    }

})


router.put("/update", authMiddleWare, async function(req,res){
    const {success} = update.safeParse(req.body);

    if(!success){
        return res.status(411).json({msg: "Error while updating information"})
    }

    await USER.updateOne(req.body,{
        _id: req.userId
    })

    return res.json({msg: "profile updated suceessfully"})
})


router.get("/bulk", authMiddleWare, async function(req,res) {
    const filter = req.query.filter || "";
    const users = await USER.find({
        $or :[{
            FirstName: {
                "$regx": filter
            }
        },
        {
            LastName: {
                "$regx": filter
            }
        }
    ]
    })

    res.json({
        user: users.map(user =>({
            username: user.username,
            FirstName: user.FirstName,
            LastName: user.LastName,
            _id: user._id

        }))
    })
})
