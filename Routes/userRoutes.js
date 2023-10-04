const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const {userModel} = require("../Modle/userModel");

const userRouter = express.Router();

userRouter.post("/signup",async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        let user = await userModel.findOne({email});
        if(!user){
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).send({msg:"Something went wrong, Try again"});
                }else{
                    let newUser = new userModel({name,email,password: hash});
                    await newUser.save();
                    res.status(201).send({msg:"Account Created Successfully!!"});
                }
            })
        }else{
            res.status(400).send({msg:"User Already Exists!!"});
        }
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        let user = await userModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,async(err,result)=>{
                if(result){
                    let token = jwt.sign({userId: user._id},"manikant");
                    res.status(200).send({msg:"Logged in Successfully!!",token,name:user.name});
                    
                }else{
                    res.status(400).send({msg:"Wrong Credentials!!"});
                }
            })
        }else{
            res.status(400).send({msg:"User doesn't Exists!!"});
        }
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})


module.exports = {userRouter};