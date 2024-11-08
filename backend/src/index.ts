import express from "express";
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());

app.post("/api/v1/signup",(async(req:any,res:any)=>{

    const {username,password} = req.body;

    try {
       res.json("signup");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}))

app.post("/api/v1/signin",(async(req:any,res:any)=>{

    const {username,password} = req.body;

    try {
       res.json("signin");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}))

app.post("/api/v1/txn/sign",(async(req:any,res:any)=>{

    const {username,password} = req.body;

    try {
       res.status(200).json(
        {
        id: "id_to_track_txn"
    }
)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}))

app.post("/api/v1/txn/?id=id",(async(req:any,res:any)=>{

    const {username,password} = req.body;

    try {
       res.status(200).json(
        {
            signatures: ["xyz"],
            status: "processing"
        }
       );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}))