const jwt = require('jsonwebtoken');
const jwt_key = process.env.KEY;

function authMiddleWare(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(403).json({msg:"invalid token"})
    }

    const token = authHeader.split(' ')[1];

    try{

        const decode = jwt.verify(token,jwt_key);
        if(decode.userId){
        req.userId = docode._id;
        next();
    }else{
        return res.status(403).json({msg:"Invalid Credentials"})
    }
        

    }catch(err){
        res.status(403).json({msg:"something went wrong while login"})
    }
}

module.exports = authMiddleWare;