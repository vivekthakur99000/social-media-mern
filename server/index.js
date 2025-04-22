import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./utils/dbConnect.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB()
  console.log(`Server running on port ${PORT}`);
});
