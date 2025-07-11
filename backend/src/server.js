require('dotenv').config();
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { Container } = require("./shared/Container");
const { createLaunchRoutes } = require("./routes/launches");
const { createPlanetRoutes } = require("./routes/planets");
const { createChatbotRoutes } = require("./routes/chatbot");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { DatabaseConnection } = require("./database/connection");
const logger = require("./shared/utils/logger");

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

async function startServer() {
  try {
    // Create app and container
    const app = express();
    const container = new Container();

    // Middleware
    app.use(
      cors({
        origin: "http://localhost:3000",
      })
    );
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "..", "public")));

    // Routes
    app.use("/v1/launches", createLaunchRoutes(container.get("launchController")));
    app.use("/v1/planets", createPlanetRoutes(container.get("planetController")));
    app.use("/v1/chatbot", createChatbotRoutes(container.get("chatbotController")));

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({ status: "OK", message: "NASA API is running" });
    });

    // Serve React app (only if public directory exists)
    app.get("/*", (req, res) => {
      const publicPath = path.join(__dirname, "..", "public", "index.html");
      if (fs.existsSync(publicPath)) {
        res.sendFile(publicPath);
      } else {
        res.status(404).json({ 
          success: false, 
          error: "Frontend not found - API only mode" 
        });
      }
    });

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);

    // Connect to database
    const dbConnection = new DatabaseConnection();
    await dbConnection.connect(MONGO_URL);

    // Load initial data
    const planetService = container.get("planetService");
    const csvPath = path.join(__dirname, "..", "data", "kepler_data.csv");

    logger.info("Loading planets data...");
    await planetService.loadFromCsv(csvPath);
    logger.info("Planets data loaded successfully");

    // Load initial launch data
    const launchService = container.get("launchService");
    const existingLaunch = await launchService.findByFlightNumber(100);

    if (!existingLaunch) {
      logger.info("Loading initial launch data...");
      // Create initial launch using the service's internal LaunchEntity
      const initialLaunchData = {
        flightNumber: 100,
        mission: "Kepler Exploration X",
        rocket: "Explorer IS1",
        launchDate: new Date("December 27, 2030"),
        target: "Kepler-442 b",
        customers: ["BIC", "NASA"],
        upcoming: true,
        success: true,
      };
      // Find a valid planet for the initial launch
      const planets = await planetService.getHabitablePlanets();
      if (planets.length > 0) {
        initialLaunchData.target = planets[0];
        // Use the service to create and save the launch directly
        const result = await launchService.createLaunch(initialLaunchData);
        if (result.success) {
          logger.info("Initial launch data loaded successfully");
        }
      }
    } else {
      logger.info("Launch data already exists");
    }

    // Create and start server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      server.close(async () => {
        await dbConnection.disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received. Shutting down gracefully...");
      server.close(async () => {
        await dbConnection.disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
