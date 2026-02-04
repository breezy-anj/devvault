import express from "express";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import snippetRoutes from "./routes/snippets.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.use(express.json());
app.use("/api/snippets", snippetRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("DevVault API is Running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
