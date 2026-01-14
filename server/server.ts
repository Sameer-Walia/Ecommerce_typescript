import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { Document, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer, { StorageEngine } from "multer";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json());

app.use(cookieParser());

const port = 4545
mongoose.connect("mongodb://127.0.0.1:27017/project_typescript").then(() => console.log("Connected to MongoDB"));

// to get images from server and show in frontend (client)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


import SignupRoutes from "./routes/SignupRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import SubCategoryRoutes from "./routes/SubCategoryRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import CartRoutes from "./routes/CartRoutes";
import OrderRoutes from "./routes/OrderRoutes";
import ResetPasswordRoutes from "./routes/ResetPasswordRoutes";

app.use("/api", SignupRoutes)
app.use("/api", CategoryRoutes)
app.use("/api", SubCategoryRoutes)
app.use("/api", ProductRoutes)
app.use("/api", CartRoutes)
app.use("/api", OrderRoutes)
app.use("/api", ResetPasswordRoutes)


app.listen(port, () =>
{
    console.log(`Server is running on port ${port}`)
})