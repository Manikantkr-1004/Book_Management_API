const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const {bookModel} = require("../Modle/bookModle")
const {auth} = require("../Middleware/auth")

const bookRouter = express.Router();

bookRouter.post("/add",auth,async(req,res)=>{
    let date= new Date().toDateString();
    req.body = {...req.body, published: date};
    try {
        let books = new bookModel(req.body);
        await books.save();
        res.status(201).send({msg:"New Book Added Successfully.",book:req.body});
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"Internal Server Error"})
    }
})

bookRouter.get("/",auth,async(req,res)=>{
    const {title,author,page} = req.query;
    try {
        let query = {};
        query.userId = req.body.userId;

        if(title!==""){
            query.title = {$regex: new RegExp(title,"i")}
        }

        if(author!==""){
            query.author = {$regex: new RegExp(author, "i")};
        }

        let skipping  = (page-1)*6

        let books = await bookModel.find(query).skip(skipping).limit(6);
        let total = await bookModel.countDocuments(query);
        res.status(200).send({books,total});
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})

bookRouter.get("/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try {
        let book = await bookModel.findOne({_id: id});
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})

bookRouter.patch("/update/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try {
        let book = await bookModel.findByIdAndUpdate({_id:id},req.body);
        res.status(200).send({msg:"Book Updated successfully"});
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
})

bookRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id} = req.params;
    try {
        let book = await bookModel.findByIdAndDelete({_id:id});
        res.status(200).send({msg:"Book Deleted successfully"});
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
})

module.exports = {bookRouter};