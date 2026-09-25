const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");

app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "STUDYCYCLE backend is running!" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });