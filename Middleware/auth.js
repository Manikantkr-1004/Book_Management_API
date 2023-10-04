const jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
    let token = req.headers.authorization?.split(" ")[1];

    if(token){
        jwt.verify(token,"manikant",(err,decoded)=>{
            if(decoded){
                req.body = {...req.body, userId: decoded.userId};
                next();
            }else{
                res.status(400).send({msg:"Token Expired, Please Login"})
            }
        })
    }else{
        res.status(400).send({msg:"Please Login"})
    }
}

module.exports = {auth};