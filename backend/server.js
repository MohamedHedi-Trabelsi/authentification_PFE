import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { createDefaultManager } from "./utils/createDefaultManager.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

connectDB().then(async () => {
  await createDefaultManager();

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Serveur lancé sur le port ${process.env.PORT || 5000}`);
  });
});