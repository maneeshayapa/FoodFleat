import express from "express";
import cors from "cors";

import foodRoutes from "./routes/foodRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/foods", foodRoutes);

app.listen(5000, () => {
  console.log("Server Started");
});