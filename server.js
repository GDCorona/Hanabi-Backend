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
app.use(express.json());
app.set('trust proxy', 1);
// URLs that are allowed to talk to backend
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...(process.env.LIVE_DOMAINS ? process.env.LIVE_DOMAINS.split(',') : [])
];
app.use(cors({
    origin: function (origin, callback) {     
        if (!origin) return callback(null, true); // Allow requests with no origin (like local testing or Postman)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // For cookies or secure sessions
}));
app.use((req, res, next) => {
    const origin = req.get('origin') || req.get('referer') || "Unknown Origin";
    console.log(`📩 Request received from: ${origin}`);
    next();
});

// Routes
app.use("/api/comments", commentRoutes);
app.use("/api/demons", demonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
