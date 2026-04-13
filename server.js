import express from "express";
import cors from "cors";
import { connectDB, configureCloudinary } from "./config/index.js";
import commentRoutes from "./routes/commentRoutes.js";
import demonRoutes from "./routes/demonRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

connectDB();
configureCloudinary();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/comments", commentRoutes);
app.use("/api/demons", demonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
