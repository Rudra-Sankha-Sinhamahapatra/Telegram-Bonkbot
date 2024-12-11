import express from "express";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import zod from "zod";
import bcrypt from "bcrypt";
import { Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET;

app.post("/api/v1/signup", async (req: any, res: any) => {
  const signupBody = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1),
  });

  try {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(403).json({
        message: "Invalid form of input",
      });
    }

    const { username, password } = req.body;

    const ExistingUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (ExistingUser) {
      return res.status(411).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const keypair = new Keypair();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = Buffer.from(keypair.secretKey).toString("base64");

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        privateKey: privateKey,
        publicKey: publicKey,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET || "jiojjkh");

    return res.status(200).json({
      message: "Signup successful",
      token,
      username,
      publicKey,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/signin", async (req: any, res: any) => {
  const signinBody = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1),
  });

  try {
    const {success} = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(403).json({
          message: "Invalid form of input",
        });
      }  

    const { username, password } = req.body;
   
    const ExistingUser = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });

      if(!ExistingUser) {
        return res.status(411).json({
            message: "User doesn't exists",
          });
      }

     const validPassword = await bcrypt.compare(password,ExistingUser.password);

     if(!validPassword) {
        return res.status(401).json({
            message:"Incorrect password"
        })
     }

     const token = jwt.sign({id:ExistingUser.id},JWT_SECRET || "jiojjkh");

    return res.status(200).json({
        message:"signed in",
        username,
        token,
        publicKey:ExistingUser.publicKey
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/txn/sign", async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    res.status(200).json({
      id: "id_to_track_txn",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/txn/?id=id", async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    res.status(200).json({
      signatures: ["xyz"],
      status: "processing",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})
