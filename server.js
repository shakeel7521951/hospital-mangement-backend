import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const PORT = process.env.PORT || 4000;
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoutes.js";
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use('/uploads', express.static('uploads'));

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB is connected...");
  })
  .catch((error) => {
    console.log("Error in connecting DB", error);
  });

app.use("/api/v1", userRoute);
app.use("/api/v1", doctorRoutes);
app.use("/api/v1", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at PORT no. ${PORT}`);
});
