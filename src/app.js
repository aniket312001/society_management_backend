const express = require("express");
const cors = require("cors");

const userRoutes         = require("./routes/userRoutes");
const societyRoutes      = require("./routes/societyRoutes");
const authRoutes         = require("./routes/authRoutes");
const visitorRoutes      = require("./routes/visitorRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const postRoutes         = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", societyRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", visitorRoutes);
app.use("/api", announcementRoutes);
app.use("/api", postRoutes);

module.exports = app;