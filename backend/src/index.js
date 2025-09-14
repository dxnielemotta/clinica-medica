import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import utilsRoutes from "./routes/utilsRoutes.js";

const app = express();

dbConnection();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Permite o localhost e a URL de produção
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/utils", utilsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
