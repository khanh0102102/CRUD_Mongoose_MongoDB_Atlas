require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const foodRouter = require("./routes/foodRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CRUD Mongoose API is running.",
    endpoints: {
      readAll: "GET /foods",
      create: "POST /food",
      update: "PATCH /food/:id",
      delete: "DELETE /food/:id",
    },
  });
});

app.use("/", foodRouter);

// Return a JSON response for unknown endpoints.
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found.",
    path: req.originalUrl,
  });
});

// Centralized error handler, including malformed JSON requests.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body contains invalid JSON." });
  }

  console.error(error);
  return res.status(500).json({
    message: "Internal server error.",
  });
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error(
      "MONGODB_URI is missing. Copy .env.example to .env and set your Atlas connection string."
    );
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Atlas connected successfully.");

    const server = app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}; shutting down gracefully...`);
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start the application:", error.message);
    process.exitCode = 1;
  }
}

startServer();
