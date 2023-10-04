const express = require("express");
const cors = require("cors");
const {connection} = require("./db");
const { userRouter } = require("./Routes/userRoutes");
const { bookRouter } = require("./Routes/bookRoutes");
const PORT = process.env.PORT || 7700;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user",userRouter);
app.use("/book",bookRouter);


app.get("/",(req,res)=>{
    res.send("Hi, You are on the main page");
})


app.listen(PORT,async(req,res)=>{
    try {
        await connection;
        console.log("Connected to the DB");
        console.log("Server is running successfully");
    } catch (error) {
        console.log(error);
    }
})