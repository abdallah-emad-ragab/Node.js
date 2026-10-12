require("dotenv").config(); // Load .env variables using dotenv package
const cors = require("cors"); // Middleware to enable CORS to give access to the front-end
const express = require('express');
const app = express();
const path = require("path");

const { ERROR } = require("./utils/httpStatusText");

const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
const Course = require("./models/coursesModel");
const User = require("./models/userModel");

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads directory

mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
    console.log("DB:", mongoose.connection.name);
    console.log("Course Collection:", Course.collection.name);
    console.log("User Collection:", User.collection.name);
}).catch((err) => {
    console.log(err);
});

app.use(cors()); // Using cors to give access to any front-end
app.use(express.json()); // Middleware to parse JSON request bodies

const coursesRoutes = require("./routers/coursesRoutes");
const userRoutes = require("./routers/userRoutes");

app.use("/api/courses", coursesRoutes);
app.use("/api/users", userRoutes);

// Global middleware for not found routes
app.all("*splat", (req, res) => {
    return res.status(404).send({ status: ERROR, message: "This resource is not available" });
});

// Global error handler (Must write 4 parameters to detect it)
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({ status: error.statusText || "error", message: error.message, data: null, code: error.status || 500 });
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT);
});