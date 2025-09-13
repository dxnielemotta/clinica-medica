import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./config/db";

const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
