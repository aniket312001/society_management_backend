const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const societyRoutes = require("./routes/societyRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", societyRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);


module.exports = app;