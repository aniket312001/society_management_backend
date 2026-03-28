const express = require("express");
const cors = require("cors");

const userRoutes         = require("./features/users/users.routes");
const societyRoutes      = require("./features/societies/society.routes");
const authRoutes         = require("./features/auth/auth.routes");
const visitorRoutes      = require("./features/visitors/visitors.routes");
const announcementRoutes = require("./features/announcement/announcement.routes");
const postRoutes         = require("./features/posts/post.routes");
const errorMiddleware = require("./middleware/error.middleware");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", societyRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", visitorRoutes);
app.use("/api", announcementRoutes);
app.use("/api", postRoutes);

app.use(errorMiddleware);

module.exports = app;