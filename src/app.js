const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const societyRoutes = require("./routes/societyRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", societyRoutes);


module.exports = app;