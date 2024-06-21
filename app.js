require("dotenv").config();
const express=require("express");
const app=express();
const cors = require('cors')
const userRouter=require("./api/users/user.router");
app.use(cors('*'));
app.use(express.json());


app.use("/api/users",userRouter);
app.use('/profile', express.static('upload/images'));
app.use('/doctorimage', express.static('upload/docotrimages'));
app.use('/hospitalimage', express.static('upload/hospitalimages'));

app.listen(process.env.APP_PORT,()=>{
    console.log("server up and running",process.env.APP_PORT)
})