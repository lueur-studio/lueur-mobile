const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Lueur API",
    time: new Date(),
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
